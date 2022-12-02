import { Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function BestPracticesPage() {
  const navigate = useNavigate();
  return (
    <>
      <Flex
        direction="column"
        p={8}
      >
        <Button variant='outline' onClick={() => navigate('..')} alignSelf='flex-start'>Back</Button>
        <Heading>Best practices</Heading>
        <Heading>General</Heading>
        <Heading>Video</Heading>
        <Heading>Images</Heading>
        <Heading>Dynamic contents</Heading>
      </Flex>
    </>
  );
}
