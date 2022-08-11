import { Flex, Heading, Text } from "@chakra-ui/react";

export default function ReportGeneralInfo() {
  return (

    <Flex justify={"stretch"} align="center" minHeight={'fit-content'}>
      <Flex direction={'column'} justify="center" p={2} grow={1}>
        <Heading size={"sm"}>KwH</Heading>
        <Text fontSize='xs'>general benefit</Text>
      </Flex>
      <Flex direction={'column'} justify="center" p={2} borderLeft={'1px solid lightgray'} grow={1}>
        <Heading size={"sm"}>CO2</Heading>
        <Text fontSize='xs'>general benefit</Text>
      </Flex>
    </Flex>
  );
}
