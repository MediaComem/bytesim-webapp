import { GenericParameters } from "../app/types/generalFormTypes";
import { Zone, ZoneFigma, ZoneType } from "../app/types/types";
import { GenericParametersSimulator } from "./simulators/generic";
import { ImageSimulator } from "./simulators/images";
import { SimulatorImages, SimulatorVideo } from "./simulators/type";
import { VideoSimulator } from "./simulators/video";

/* Service to simulate the impact of a specific zone
 *  Create simulator for the give zone
 *    const simulator = simulationService.simulator(zone);
 *  Estimate impact of zone
 *    const { energy, co2 } = simulator.simulate();
 *  Get recommandations
 *    const recommandations = simulator.recommandations();
 */
class simulationService {
  // medium voltage CH electricity factor (data center + core network)
  private static electricityCHMediumNRE = 6.7217031; // Non renewable primary energy (MJp) part per KWh
  private static electricityCHMediumRE = 2.1383485; // Renewable primary energy (MJp) part per KWh
  private static electricityMJPerKWh =
    this.electricityCHMediumNRE + this.electricityCHMediumRE;

  private static electricityGWPPerKWh = 0.1203783; // Global Warming Potential (GWP) in kg CO2eq
  private static electricityGreenMediumNRE = 0.43113971; // Green energy still use minimal primary non renewable energy in full LCA
  private static electricityGreenMediumRE = 3.9240857;
  private static electricityGreenMJPerKWh =
    this.electricityCHMediumNRE + this.electricityCHMediumRE;

  private static electricityGreenGWPPerKWh = 0.03481005; // Global Warming Potential (GWP) in kg CO2eq

  private static dataCenterKWhPerByte = 6.16e-11;
  private static coreNetworkKWhPerByte = 8.39e-11;

  private static dataCenterEnergyMJ(bytes: number) {
    return this.electricityMJPerKWh * this.dataCenterKWhPerByte * bytes;
  }

  private static dataCenterRenewableEnergyMJ(bytes: number) {
    return this.electricityGreenMJPerKWh * this.dataCenterKWhPerByte * bytes;
  }

  private static networkEnergyMJ(bytes: number) {
    // Assuming standard mix for core network
    return this.electricityMJPerKWh * this.coreNetworkKWhPerByte * bytes;
  }

  static energyMJ(bytes: number, renewable: boolean) {
    if (renewable) {
      return (
        this.dataCenterRenewableEnergyMJ(bytes) + this.networkEnergyMJ(bytes)
      );
    } else {
      return this.dataCenterEnergyMJ(bytes) + this.networkEnergyMJ(bytes);
    }
  }

  private static dataCenterGWP(bytes: number) {
    return this.electricityGWPPerKWh * this.dataCenterKWhPerByte * bytes;
  }

  private static dataCenterRenewableGWP(bytes: number) {
    return this.electricityGreenGWPPerKWh * this.dataCenterKWhPerByte * bytes;
  }

  private static networkGWP(bytes: number) {
    // Assuming standard mix for core network
    return this.electricityGWPPerKWh * this.coreNetworkKWhPerByte * bytes;
  }

  static gwpRenewableFactor() {
    return this.electricityGreenGWPPerKWh / this.electricityGWPPerKWh;
  }

  static gwp(bytes: number, renewable: boolean) {
    if (renewable) {
      return this.dataCenterRenewableGWP(bytes) + this.networkGWP(bytes);
    } else {
      return this.dataCenterGWP(bytes) + this.networkGWP(bytes);
    }
  }

  static genericParametersSimulator(parameters: GenericParameters) {
    return new GenericParametersSimulator(parameters);
  }

  static simulator(
    zone: Zone | ZoneFigma,
    renewable: boolean
  ): SimulatorVideo | SimulatorImages | undefined {
    if (!zone.params) {
      // console.log(`No parameters for Zone ${zone.id}`);
      return undefined;
    }
    switch (zone.zoneType) {
      case ZoneType.Video:
        return new VideoSimulator(zone, renewable);
      case ZoneType.Images:
        return new ImageSimulator(zone, renewable);
    }
  }
}

export default simulationService;
