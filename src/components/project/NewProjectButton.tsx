import { Button } from "@chakra-ui/react";
import * as React from "react";

export default function NewProjectButton() {
  //const dispatch = useDispatch();
  const createNewProject = () => {
    console.log("new project created in store");
  };
  return (
    <>
      <Button
        onClick={() => {
          createNewProject();
          window.open("./bytesim-webapp/new", "_blank");
        }}
        // FOR NOW DISABLED AS NEW PROJECT IS WIND
      //disabled
      >
        New project
      </Button>
    </>
  );
}
