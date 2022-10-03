import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ExportButton() {
const navigate = useNavigate();
  return (
    <>
      <Button
        variant={"outline"}
        alignSelf={'center'}
        justifySelf={'flex-end'}
        colorScheme="black"
        onClick={() => {
            navigate('/bytesim-webapp/export');
        }}
      >
        Export
      </Button>
    </>
  );
}
