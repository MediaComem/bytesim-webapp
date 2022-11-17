import { Accordion } from "@chakra-ui/react";
import { GenericParameters } from "../../app/types/generalFormTypes";
import { RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import RecommandationsByZone from "./RecommandationsByZone";

export type RecommandationType = RecommandationWithZone<
  | VideoParameters[keyof VideoParameters]
  | GenericParameters[keyof GenericParameters]
>;

interface RecommandationsListProps {
  recommandations: RecommandationType[];
  allOpen: boolean;
}
export default function RecommandationsList({
  recommandations,
  allOpen,
}: RecommandationsListProps) {
  const indexes = Array.from(recommandations.keys());

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

  return (
    <Accordion allowToggle index={allOpen ? indexes : undefined}>
      {Object.entries(recoGroupedByZone(recommandations))?.map(
        ([key, value]) => (
          <RecommandationsByZone
            key={key}
            zoneRecommandations={value as RecommandationType[]}
            zoneId={key}
          />
        )
      )}
    </Accordion>
  );
}
