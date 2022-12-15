import { Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSvgDims } from "../../features/figma/utils";

export default function ExportButton() {
  const { search } = useLocation(); // keep image params
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant={"solid"}
        alignSelf={"center"}
        justifySelf={"flex-end"}
        onClick={() => {
          localStorage.setItem(
            "svgWidth",
            getSvgDims()?.width?.toString() || ""
          );
          navigate(`/export${search}`); // keep url params
        }}
        size="sm"
        minWidth="min-content"
      >
        Export
      </Button>
    </>
  );
}
