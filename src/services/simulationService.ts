import { nanoid } from "@reduxjs/toolkit";
import { ImagesParameters } from "../app/types/imgTypes";
import { Recommandation } from "../app/types/recommandations";
import { Zone, ZoneType } from "../app/types/types";
import { EVideoDuration, EVideoQuality, VideoParameters } from "../app/types/videoTypes";

export interface Simulator {
  simulate: () => { energy: number, co2: number};
}

export interface SimulatorVideo extends Simulator{
  recommandations: () => Recommandation<VideoParameters[keyof VideoParameters]>[];
}

export interface SimulatorImages extends Simulator{
  recommandations: () => Recommandation<ImagesParameters[keyof ImagesParameters]>[];
}

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
  private static electricityMJPerKWh = this.electricityCHMediumNRE + this.electricityCHMediumRE;
  private static electricityGWPPerKWh = 0.1203783; // Global Warming Potential (GWP) in kg CO2eq
  private static electricityGreenMediumNRE = 0.43113971; // Green energy still use minimal primary non renewable energy in full LCA
  private static electricityGreenMediumRE = 3.9240857;
  private static electricityGreenMJPerKWh = this.electricityCHMediumNRE + this.electricityCHMediumRE;
  private static electricityGreenGWPPerKWh = 0.03481005; // Global Warming Potential (GWP) in kg CO2eq

  private static dataCenterKWhPerByte = 6.16E-11;
  private static coreNetworkKWhPerByte = 8.39E-11;

  private static dataCenterEnergyMJ(bytes: number) {
    // TODO get server energy source from store (renewable or unknown)
    // this.electricityGreenMJPerKWh * this.dataCenterKWhPerByte * bytes
    return this.electricityMJPerKWh * this.dataCenterKWhPerByte * bytes;
  }

  private static networkEnergyMJ(bytes: number) {
    // Assuming standard mix for core network
    return this.electricityMJPerKWh * this.coreNetworkKWhPerByte * bytes;
  }

  static energyMJ(bytes: number) {
    return this.dataCenterEnergyMJ(bytes) + this.networkEnergyMJ(bytes);
  }

  private static dataCenterGWP(bytes: number) {
    // TODO get server energy source from store (renewable or unknown)
    // this.electricityGreenMJPerKWh * this.dataCenterKWhPerByte * bytes
    return this.electricityGWPPerKWh * this.dataCenterKWhPerByte * bytes;
  }

  private static networkGWP(bytes: number) {
    // Assuming standard mix for core network
    return this.electricityGWPPerKWh * this.coreNetworkKWhPerByte * bytes;
  }

  static gwp(bytes: number) {
    return this.dataCenterGWP(bytes) + this.networkGWP(bytes);
  }

  static simulator(zone: Zone): SimulatorVideo | SimulatorImages | undefined {
    if (!zone.params) {
      console.log(`No parameters for Zone ${zone.id}`);
      return undefined;
    }
    switch (zone.zoneType) {
      case ZoneType.Video:
        return new VideoSimulator(zone.params);
      case ZoneType.Imgs:
        return new ImageSimulator(zone.params);
    }
  }
}

// TODO create separate folder for simulators per type
class VideoSimulator implements SimulatorVideo {
  video: VideoParameters;

  constructor(parameters: VideoParameters) {
    this.video = parameters;
  }

  // Video size in bytes
  private videoSize(params: VideoParameters) {
    // https://support.google.com/youtube/answer/1722171
    // https://help.netflix.com/en/node/306
    const bitratesMbps: { [key in EVideoQuality]: number } = {
      [EVideoQuality.RES_480_P]: 2.5,
      [EVideoQuality.RES_720_P]: 5,
      [EVideoQuality.RES_1080_P]: 8,
      [EVideoQuality.RES_4K]: 35
    };
    const durations: { [key in EVideoDuration]: number } = {
      [EVideoDuration.DUR_10_SEC]: 10,
      [EVideoDuration.DUR_10_30_SEC]: 30,
      [EVideoDuration.DUR_30_SEC_2_MIN]: 120,
      [EVideoDuration.DUR_2_5_MIN]: 300,
      [EVideoDuration.DUR_5_MIN]: 600
    };

    if (!params.quality || !params.duration) {
      throw new Error(`Missing some parameters for video`)
    }

    const quality = params.quality;
    const durationSec = durations[params.duration];

    // TODO handle GIF format
    return 1000000 * bitratesMbps[quality] * durationSec / 8;
  }

  private simulateParameters(params: VideoParameters) {
    const videoSize = this.videoSize(params);
    const energy = simulationService.energyMJ(videoSize);
    const co2 = simulationService.gwp(videoSize);
    return { energy, co2 };
  }

  simulate() {
    return this.simulateParameters(this.video);
  }

  recommandations() {
    const recommandations: Recommandation<EVideoQuality>[] = [];
    const currentImpact = this.simulate();
    // TODO check all parameters
    const resolution = this.video.quality;
    if (resolution) {
      const resolutions = Object.values(EVideoQuality);
      const idx = resolutions.findIndex((res) => res === resolution);
      if (idx !== 0) {
        const better = resolutions[idx - 1];
        const betterParams = {
          ...this.video,
          quality: better
        };
        const { energy: energyBetter, co2: co2Better } = this.simulateParameters(betterParams);
        const recommandation = {
          id: nanoid(),
          parameter: 'Video quality',
          currentValue: resolution,
          betterValue: better,
          benefits: {
            energy: currentImpact.energy - energyBetter,
            co2: currentImpact.co2 - co2Better
          }
        }
        recommandations.push(recommandation);
      }
    }
    return recommandations;
  }
}

class ImageSimulator implements SimulatorImages {
  images: ImagesParameters;

  constructor(parameters: ImagesParameters) {
    this.images = parameters;
  }

  simulate() {
    return { energy: 0, co2: 0 };
  }

  recommandations() {
    return [];
  }
}

export default simulationService;