import { Accordion } from "@chakra-ui/react";
import { Benefits, RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import RecommandationDisplay from "./Recommandation";

interface RecommandationsListProps {
  recommandations: RecommandationWithZone<VideoParameters[keyof VideoParameters]>[];
  updateTotalBenefits: (benef: Benefits, substract?: boolean)=>void;
}
export default function RecommandationsList({
  recommandations,
  updateTotalBenefits
}: RecommandationsListProps) {
  return (
    <Accordion allowToggle allowMultiple>
      {recommandations.map((reco) => (
        <RecommandationDisplay key={reco.id} recommandation={reco} updateTotalBenefits={updateTotalBenefits}/>
      ))}
    </Accordion>
  );
}
