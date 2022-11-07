import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ExportButton() {
const navigate = useNavigate();
  return (
    <>
      <Button
        variant={"solid"}
        alignSelf={'center'}
        justifySelf={'flex-end'}
        onClick={() => {
            navigate('/bytesim-webapp/export');
        }}
        size='sm'
        minWidth='min-content'
      >
        Export
      </Button>
    </>
  );
}
