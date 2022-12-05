import {
  Recommandation,
  RecommandationTypes,
} from "../../app/types/recommandations";
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

    const quality = params.quality;
    const durationSec = durations[params.duration!];

    const sizeBytes = (1000000 * bitratesMbps[quality!] * durationSec) / 8;
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
    const energy =
      simulationService.energyMJ(videoSize, this.renewable) *
      this.numberOfVisits;
    const co2 =
      simulationService.gwp(videoSize, this.renewable) * this.numberOfVisits;
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
    } as VideoParameters);
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
        "quality",
        {
          title: "Is the definition of the image (here: video) reduced and adapted to its objective?",
          body: "Illustrative images and images (and videos) that carry more contractual information such as the image of a product do not have the same needs for quality details. The adaptation of the level of quality to the importance of the image makes it possible to reduce the environmental footprint of the less critical needs for the service.",
          link: "https://gr491.isit-europe.org/en/crit.php?id=9-5063-frontend-illustrative-images-and-images-that-carry-more"
        }
      );
      recommandations.push(...recommandationsQuality);
      const recommandationsDuration = this.betterOptionsRecommandations(
        currentImpact,
        EVideoDuration,
        this.video,
        "duration",
        {
          title: "Is the size of data stored on user device limited ?",
          body: "All items transfered to user device have impact on the network, on compute time required to process. Reducing the size of these items is important.",
          link: "https://gr491.isit-europe.org/en/crit.php?id=10-5085-frontend-all-items-transfered-to-user-device-have"
        }
      );
      recommandations.push(...recommandationsDuration);
      const recommandationsFormat = this.betterOptionsRecommandations(
        currentImpact,
        EVideoFormat,
        this.video,
        "format",
        {
          title:
            "Have the different image/video formats available been evaluated to select only the most effective ?",
          body: "Digital services use images/videos for illustration or information purposes. The sizes, degrees of definition, encoding formats have a significant impact on the size of the files of these images/videos. Reducing volumes makes it possible to limit environmental footprints.",
          link: "https://gr491.isit-europe.org/en/crit.php?id=9-5061-frontend-digital-services-use-images-for-illustration-or",
        }
      );
      recommandations.push(...recommandationsFormat);
      const recommandationsAutoplay = this.messageForBetterRecommandations(
        EBoolean,
        this.video,
        "autoplay",
        RecommandationTypes.WARNING,
        videoWarnings.autoplay,
        {
          title: 'Is it really a user action that triggers the "play" ?',
          body: "Active content uses technical resources to function. The activity of these components should be started at the request of the user to avoid consuming energy unnecessarily.",
          link: "https://gr491.isit-europe.org/en/crit.php?id=9-5071-frontend-active-content-uses-technical-resources-to-function."
        }
      );
      recommandations.push(...recommandationsAutoplay);
      const recommandationsLoop = this.messageForBetterRecommandations(
        EBoolean,
        this.video,
        "loop",
        RecommandationTypes.WARNING,
        videoWarnings.loop,
        {
          title: "Are videos or animations outside the active area automatically paused / stopped ?",
          body: "The active content, animations, videos, sounds launched by the user may no longer be visible on the screen area presented to the user during navigation. Continuing to distribute this content becomes unnecessary and unnecessarily consumes resources, so it should be stopped.",
          link: "https://gr491.isit-europe.org/en/crit.php?id=9-5072-frontend-the-active-content-animations-videos-sounds-launched"
        }
      );
      recommandations.push(...recommandationsLoop);
    }
    return recommandations;
  }
}
