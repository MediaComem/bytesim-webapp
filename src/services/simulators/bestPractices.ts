import { BestPracticeMessage } from "../../app/types/recommandations";

export const bestPracticesGR491: Record<
  string,
  Record<string, BestPracticeMessage>
> = {
  /* Essentials: {
        needs:
        usage:
        opensource:
    }, */
  GeneralParameters: {
    server: {
      title: "Does the electricity come from renewable energies ?",
      body: "The activity of a data center requires energy. The energy sources will determine the environmental footprint. Low-carbon and renewable energy solutions will reduce this impact.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=4-8039-hosting-the-activity-of-a-data-center-requires",
    },
    plugins: {
      title:
        "Do the libraries used allow you to take only the components that are actually useful ?",
      body: "Very often components from public libraries (open source or commercial) provide a set of functionalities which are rarely all used and drain dependencies on other components with the same characteristics. In the end, the project aggregates a large volume of the library while a small part is actually used. Favoring components whose dependencies and functionalities are controllable in relation to the needs is efficient from the sustainable IT point of view.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=3-5019-frontend-very-often-components-from-public-libraries-",
    },
    genericFonts: {
      title: "Do you limit the number of fonts loaded for the service ?",
      body: "Each font is encoded in a file presenting all the associated symbols, which represents a large volume of data exchanged and manipulated. The system fonts are embedded in the presentation tools and are not conveyed, the flows are therefore reduced when they are used.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=9-5075-frontend-each-font-is-encoded-in-a-file",
    },
    infiniteScroll: {
      title: "Is the size of data stored on user device limited ?",
      body: "All items transfered to user device have impact on the network, on compute time required to process. Reducing the size of these items is important.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=10-5085-frontend-all-items-transfered-to-user-device-have",
    },
  },
  Video: {
    format: {
      title:
        "Have the different image/video formats available been evaluated to select only the most effective ?",
      body: "Digital services use images/videos for illustration or information purposes. The sizes, degrees of definition, encoding formats have a significant impact on the size of the files of these images/videos. Reducing volumes makes it possible to limit environmental footprints.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=9-5061-frontend-digital-services-use-images-for-illustration-or",
    },
    quality: {
      title:
        "Is the definition of the image (here: video) reduced and adapted to its objective?",
      body: "Illustrative images and images (and videos) that carry more contractual information such as the image of a product do not have the same needs for quality details. The adaptation of the level of quality to the importance of the image makes it possible to reduce the environmental footprint of the less critical needs for the service.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=9-5063-frontend-illustrative-images-and-images-that-carry-more",
    },
    duration: {
      title: "Is the size of data stored on user device limited ?",
      body: "All items transfered to user device have impact on the network, on compute time required to process. Reducing the size of these items is important.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=10-5085-frontend-all-items-transfered-to-user-device-have",
    },
    autoplay: {
      title: 'Is it really a user action that triggers the "play" ?',
      body: "Active content uses technical resources to function. The activity of these components should be started at the request of the user to avoid consuming energy unnecessarily.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=9-5071-frontend-active-content-uses-technical-resources-to-function.",
    },
    loop: {
      title:
        "Are videos or animations outside the active area automatically paused / stopped ?",
      body: "The active content, animations, videos, sounds launched by the user may no longer be visible on the screen area presented to the user during navigation. Continuing to distribute this content becomes unnecessary and unnecessarily consumes resources, so it should be stopped.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=9-5072-frontend-the-active-content-animations-videos-sounds-launched",
    },
  },
  Images: {
    format: {
      title:
        "Have the different image formats available been evaluated to select only the most effective ?",
      body: "Digital services use images for illustration or information purposes. The sizes, degrees of definition, encoding formats have a significant impact on the size of the files of these images. Reducing volumes makes it possible to limit environmental footprints.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=9-5061-frontend-digital-services-use-images-for-illustration-or",
    },
    quantity: {
      title: "Are you reducing the number of pictograms used in the service ?",
      body: "All presentation elements have a weight greater than the characters of the alphabet. Each time a pictogram is used when the information it conveys could be presented differently, the service increases its volume. In addition, accessibility assistants do not always make it possible to render these pictograms in good conditions.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=9-5074-frontend-all-presentation-elements-have-a-weight-greater",
    },
    size: {
      title:
        "Is the definition of the image reduced and adapted to its objective (illustration, contractual, ...) ?",
      body: "Illustrative images and images that carry more contractual information such as the image of a product do not have the same needs for quality details. The adaptation of the level of quality to the importance of the image makes it possible to reduce the environmental footprint of the less critical needs for the service.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=9-5063-frontend-illustrative-images-and-images-that-carry-more",
    },
  },
  DynContent: {
    dynMap: {
      title:
        "Are cartography objects, animations, videos presented in a static mode ?",
      body: "Mapping objects are not always relevant to be presented in the form of dynamic and interactive objects. The static image version of the plans can provide the user with enough information without having to interact with the object. Mapping objects are complex and require processing resources and the use of sensors, which the image versions of plans avoid. The user retains the possibility of interaction by activating the dynamic version but only at his request.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=10-5082-frontend-mapping-objects-are-not-always-relevant-to",
    },
    advertising: {
      title:
        "Is user attention captured with their consent and for the uses they expect ?",
      body: "The attention of the user is a resource that should be considered scarce and valuable. From this perspective, respect for the user also depends on his ability to focus his attention on the elements of his choice, rather than those that the service would like to highlight.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=8-5057-frontend-the-attention-of-the-user-is-a",
    },
    analytics: {
      title:
        "Is the data fed back by the APIs really only the data that the application needs when it is requested ?",
      body: "The journeys and needs of users are very difficult to anticipate. One trend is to collect as much front end data as possible to cover as many use cases as possible. This practice is inefficient from an IT point of view. Sustainable because the collection, the processing, the routing, the local storage of the data generates a load and therefore a significant energy consumption without certainty that all this data will actually be used. The service footprint must be reduced by collecting only essential data as the service unfolds through API mechanisms.",
      link: "https://gr491.isit-europe.org/en/crit.php?id=3-5017-frontend-the-journeys-and-needs-of-users-are",
    },
  },
};
