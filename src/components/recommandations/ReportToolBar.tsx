import { Flex, Heading, Tooltip } from "@chakra-ui/react";

  export default function ReportToolbar() {
    return (
        <Flex align={'center'} p={2}>
            <Heading mr={1} size='sm'>Recommandations</Heading>
            <Tooltip label='Recommandations are based on what data you provided for your drawn zones.' hasArrow>ⓘ</Tooltip>
        </Flex>
    );
  }
