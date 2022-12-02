import { Recommandation, RecommandationTypes } from "../../app/types/recommandations";
import { EBoolean, Zone } from "../../app/types/types";
import {
  VideoParameters,
  EVideoQuality,
  EVideoDuration,
  EVideoFormat,
} from "../../app/types/videoTypes";
import { isZoneComplete } from "../../utils/utils";
import simulationService from "../simulationService";
import { videoWarnings } from "./messages";
import { SimulatorVideo } from "./type";
import { ZoneSimulator } from "./zoneSimulator";

export class VideoSimulator extends ZoneSimulator implements SimulatorVideo {
  video: VideoParameters;
  renewable: boolean;
  zone: Zone;

  constructor(zone: Zone, renewable: boolean, numberOfVisits: number) {
    super(zone.id, numberOfVisits);
    this.video = zone.params;
    this.renewable = renewable;
    this.zone_id = zone.id;
    this.zone = zone;
  }

  // Video size in bytes
  private videoSize(params: VideoParameters) {
    // https://support.google.com/youtube/answer/1722171
    // https://help.netflix.com/en/node/306
    const bitratesMbps: { [key in EVideoQuality]: number } = {
      [EVideoQuality.RES_480_P]: 2.5,
      [EVideoQuality.RES_720_P]: 5,
      [EVideoQuality.RES_1080_P]: 8,
      [EVideoQuality.RES_4K]: 35,
    };
    const durations: { [key in EVideoDuration]: number } = {
      [EVideoDuration.DUR_10_SEC]: 10,
      [EVideoDuration.DUR_10_30_SEC]: 30,
      [EVideoDuration.DUR_30_SEC_2_MIN]: 120,
      [EVideoDuration.DUR_2_5_MIN]: 300,
      [EVideoDuration.DUR_5_MIN]: 600,
    };

    if (!params.quality || !params.duration) {
      throw new Error(`Missing some parameters for video`);
    }

    const quality = params.quality;
    const durationSec = durations[params.duration];

    const sizeBytes = (1000000 * bitratesMbps[quality] * durationSec) / 8;
    if (params.format === EVideoFormat.FORMAT_GIF) {
      // GIF approximated to 3 times size of MP4
      return 3 * sizeBytes;
    }
    return sizeBytes;
  }

  protected simulateParameters(params: VideoParameters): {
    energy: number;
    co2: number;
  } {
    const videoSize = this.videoSize(params);
    const energy = simulationService.energyMJ(videoSize, this.renewable) * this.numberOfVisits;
    const co2 = simulationService.gwp(videoSize, this.renewable) * this.numberOfVisits;
    return { energy, co2 };
  }

  simulate() {
    return this.simulateParameters(this.video);
  }

  simulateOptimal() {
    return this.simulateParameters({
      format: EVideoFormat.FORMAT_VIDEO,
      quality: EVideoQuality.RES_480_P,
      duration: EVideoDuration.DUR_10_SEC,
      autoplay: EBoolean.NO,
      loop: EBoolean.NO,
    } as VideoParameters)
  }

  recommandations() {
    const recommandations: Recommandation<EVideoQuality | EVideoDuration>[] =
      [];
    const currentImpact = this.simulate();
    //show recommandations only if the zone params are fully filled
    if (isZoneComplete(this.zone)) {
      const recommandationsQuality = this.betterOptionsRecommandations(
        currentImpact,
        EVideoQuality,
        this.video,
        "quality"
      );
      recommandations.push(...recommandationsQuality);
      const recommandationsDuration = this.betterOptionsRecommandations(
        currentImpact,
        EVideoDuration,
        this.video,
        "duration"
      );
      recommandations.push(...recommandationsDuration);
      const recommandationsFormat = this.betterOptionsRecommandations(
        currentImpact,
        EVideoFormat,
        this.video,
        "format"
      );
      recommandations.push(...recommandationsFormat);
      const recommandationsAutoplay = this.messageRecommandations(
        EBoolean,
        this.video,
        "autoplay",
        RecommandationTypes.WARNING,
        videoWarnings.autoplay
      );
      recommandations.push(...recommandationsAutoplay);
      const recommandationsLoop = this.messageRecommandations(
        EBoolean,
        this.video,
        "loop",
        RecommandationTypes.WARNING,
        videoWarnings.loop
      );
      recommandations.push(...recommandationsLoop);
    }
    return recommandations;
  }
}
