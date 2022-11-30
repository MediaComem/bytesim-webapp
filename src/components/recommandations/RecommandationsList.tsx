import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { GenericParameters } from "../../app/types/generalFormTypes";
import { RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import RecommandationsByZone from "./RecommandationsByZone";
import { FilterType } from "./RecoReport";

export type RecommandationType = RecommandationWithZone<
  | VideoParameters[keyof VideoParameters]
  | GenericParameters[keyof GenericParameters]
>;

interface RecommandationsListProps {
  recommandations: RecommandationType[];
  allOpen: boolean;
  filterBy: FilterType;
}

const groupBy = (array: any[], property: any) =>
  array.reduce(
    (grouped, element) => ({
      ...grouped,
      [element[property]]: [...(grouped[element[property]] || []), element],
    }),
    {}
  );

const recoGroupedByZone = (recommandations: RecommandationType[]) => {
  return groupBy(recommandations, "zoneId");
};

type RecoGroupedByZoneType = ReturnType<typeof recoGroupedByZone>;

const getFilteredRecoGroupedByZone = (
  recoGroupedByZone: RecoGroupedByZoneType,
  filterBy: FilterType
) => {
  const arrReco = Object.values(recoGroupedByZone).map(
    (value) => value
  ) as RecommandationType[][];
  const generic = arrReco[0];
  const arrZoneReco = arrReco.slice(1);
  switch (filterBy) {
    case FilterType.NAME:
      arrZoneReco.sort((a, b) => {
        if (a.length < 1 && b.length < 1) {
          return 1;
        }
        return a[1].zoneName.localeCompare(b[1].zoneName);
      });
      break;
    case FilterType.POTENTIEL_GAIN:
      //Data are not ready yet. Temporary
      arrZoneReco.sort((a, b) => {
        if (a.length < 1 && b.length < 1) {
          return 1;
        }
        return (
          b
            .slice(1)
            .reduce((acc, curr) => acc + (curr?.benefitsBest?.energy ?? 0), 0) -
          a
            .slice(1)
            .reduce((acc, curr) => acc + (curr?.benefitsBest?.energy ?? 0), 0)
        );
      });
      break;
    default:
      break;
  }
  return [generic, ...arrZoneReco];
};

export default function RecommandationsList({
  recommandations,
  allOpen,
  filterBy,
}: RecommandationsListProps) {
  const [zoneIdOpened, setZonesIdOpened] = useState<string | undefined>(
    undefined
  );

  const filteredRecoGroupedByZone = getFilteredRecoGroupedByZone(
    recoGroupedByZone(recommandations),
    filterBy
  );
  const indexes = filteredRecoGroupedByZone.map((_, i) => i);

  const onToggleAccordion = (zoneId: string) => {
    const newZoneIdOpened = zoneIdOpened === zoneId ? undefined : zoneId;
    setZonesIdOpened(newZoneIdOpened);
  };

  const getOpenIndex = () => {
    const zoneIndex = filteredRecoGroupedByZone.findIndex(
      (z) => z[0].zoneId === zoneIdOpened
    );
    return zoneIndex === -1 ? undefined : zoneIndex;
  };

  const indexOpen = (allOpen ? indexes : getOpenIndex()) ?? -1;
  return (
    <Accordion allowToggle index={indexOpen}>
      {filteredRecoGroupedByZone?.map((value) => {
        const isOpenAccordion = allOpen || zoneIdOpened === value[0].zoneId;
        return (
          <RecommandationsByZone
            key={value[0].zoneId}
            zoneRecommandations={value as RecommandationType[]}
            zoneId={value[0].zoneId}
            onToggleAccordion={onToggleAccordion}
            isOpenAccordion={isOpenAccordion}
          />
        );
      })}
    </Accordion>
  );
}
