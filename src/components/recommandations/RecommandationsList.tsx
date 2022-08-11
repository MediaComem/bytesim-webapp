import { Accordion } from "@chakra-ui/react";
import Recommandation from "./Recommandation";

/*   interface RecommandationsListProps {
    recommandations: [];
  } */
  export default function RecommandationsList() {
    return (
      <Accordion allowToggle allowMultiple>
        <Recommandation />
      </Accordion>
    );
  }
