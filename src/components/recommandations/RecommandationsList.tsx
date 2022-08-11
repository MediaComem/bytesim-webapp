import { Accordion } from "@chakra-ui/react";
import { RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import RecommandationDisplay from "./Recommandation";

interface RecommandationsListProps {
  recommandations: RecommandationWithZone<VideoParameters[keyof VideoParameters]>[];
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
