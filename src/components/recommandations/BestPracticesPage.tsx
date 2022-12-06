import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { bestPracticesGR491 } from "../../services/simulators/bestPractices";
import AccordionChevron from "../layout/AccordionChevron";
import { BPTooltipContent } from "./Recommandation";

export default function BestPracticesPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const imageParams = search.split("&")[0];
  return (
    <>
      <Flex direction="column" p={6}>
        <Flex
          gap={4}
          align="center"
          justifyContent={"space-between"}
          marginBottom={4}
        >
          <Heading size="xl">Best practices</Heading>
          <Button
            variant="outline"
            colorScheme={"brand"}
            onClick={() => navigate(`/figma${imageParams}`)}
            alignSelf="flex-start"
            size={"sm"}
          >
            Back
          </Button>
        </Flex>
        <Flex direction="column">
          <Accordion allowToggle>
            <AccordionItem borderTop={"none"}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ backgroundColor: "brand.100" }}
                    gap={"10px"}
                  >
                    <AccordionChevron isExpanded={isExpanded} />
                    <Heading size={"lg"}>General parameters</Heading>
                  </AccordionButton>
                  <AccordionPanel>
                    {Object.values(bestPracticesGR491.GeneralParameters).map(
                      (bp) => {
                        return (
                          <>
                            <BPTooltipContent recommandationBP={bp} />
                          </>
                        );
                      }
                    )}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
            <AccordionItem borderTop={"none"}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ backgroundColor: "brand.100" }}
                    gap={"10px"}
                  >
                    <AccordionChevron isExpanded={isExpanded} />
                    <Heading size={"lg"}>Video</Heading>
                  </AccordionButton>
                  <AccordionPanel>
                    {Object.values(bestPracticesGR491.Video).map((bp) => {
                      return (
                        <>
                          <BPTooltipContent recommandationBP={bp} />
                        </>
                      );
                    })}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
            <AccordionItem borderTop={"none"}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ backgroundColor: "brand.100" }}
                    gap={"10px"}
                  >
                    <AccordionChevron isExpanded={isExpanded} />
                    <Heading size={"lg"}>Images</Heading>
                  </AccordionButton>
                  <AccordionPanel>
                    {Object.values(bestPracticesGR491.Images).map((bp) => {
                      return (
                        <>
                          <BPTooltipContent recommandationBP={bp} />
                        </>
                      );
                    })}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
            <AccordionItem border={"none"}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ backgroundColor: "brand.100" }}
                    gap={"10px"}
                  >
                    <AccordionChevron isExpanded={isExpanded} />
                    <Heading size={"lg"}>Dynamic contents</Heading>
                  </AccordionButton>
                  <AccordionPanel>
                    {Object.values(bestPracticesGR491.DynContent).map((bp) => {
                      return (
                        <>
                          <BPTooltipContent recommandationBP={bp} />
                        </>
                      );
                    })}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
        </Flex>
        <Text marginTop={4} fontSize={"sm"}>
          Find all best practices to design sustainable digital services on:{" "}
          <Link href="https://gr491.isit-europe.org/en/" color="brand.500">
            https://gr491.isit-europe.org/en/
          </Link>
        </Text>
      </Flex>
    </>
  );
}
