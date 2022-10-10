import { Accordion } from "@chakra-ui/react";
import { GenericParameters } from "../../app/types/generalFormTypes";
import { RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import RecommandationDisplay from "./Recommandation";

interface RecommandationsListProps {
  recommandations: RecommandationWithZone<VideoParameters[keyof VideoParameters] | GenericParameters[keyof GenericParameters]>[];
  allOpen: boolean;
}
export default function RecommandationsList({
  recommandations,
  allOpen
}: RecommandationsListProps) {
  const indexes = Array.from(recommandations.keys());
  return (
    <Accordion allowToggle index={allOpen ? indexes : undefined}>
      {recommandations.map((reco) => (
        <RecommandationDisplay key={reco.id} recommandation={reco} />
      ))}
    </Accordion>
  );
}
