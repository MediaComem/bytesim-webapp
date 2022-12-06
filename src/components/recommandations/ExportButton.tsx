import { Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ExportButton() {
  const { search } = useLocation(); // keep image params
  const imageParams = search.split("&")[0];
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant={"solid"}
        alignSelf={"center"}
        justifySelf={"flex-end"}
        onClick={() => {
          navigate(`/export${imageParams}`); // keep url params
        }}
        size="sm"
        minWidth="min-content"
      >
        Export
      </Button>
    </>
  );
}
