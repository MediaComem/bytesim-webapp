import { Accordion } from "@chakra-ui/react";
import { Recommandation } from "../../app/types/recommandations";
import { ZoneParamsType } from "../../app/types/types";
import RecommandationDisplay from "./Recommandation";

interface RecommandationsListProps {
  recommandations: Recommandation<ZoneParamsType[keyof ZoneParamsType]>[];
}
export default function RecommandationsList({
  recommandations,
}: RecommandationsListProps) {
  return (
    <Accordion allowToggle allowMultiple>
      {recommandations.map((reco) => (
        <RecommandationDisplay key={reco.id} recommandation={reco}/>
      ))}
    </Accordion>
  );
}
