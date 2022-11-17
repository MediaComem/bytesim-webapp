import { Button } from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { projectAdded } from "../../features/project/projectsSlice";

export default function NewProjectButton() {
  const dispatch = useDispatch();
  const createNewProject = async () => {
    return dispatch(projectAdded()).payload.id;
  };
  return (
    <>
      <Button
        onClick={() => {
            createNewProject().then((value) => {
            window.open(`./bytesim-webapp/${value}`, "_blank");
          });
        }}
      >
        New project
      </Button>
    </>
  );
}
