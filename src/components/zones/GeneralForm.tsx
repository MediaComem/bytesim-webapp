import {
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import {
  GeneralFormEntries,
  StockGeneralFormat,
} from "../../app/types/generalFormTypes";
import { Project } from "../../app/types/types";
import {
  projectReset,
  projectUpdated,
} from "../../features/project/projectSlice";
import AccordionItemTitleWithButton from "../layout/AccordionItemTitleWithButton";
import ConfirmModal from "../layout/ConfirmModal";
import ProgressPoints from "../layout/ProgressPoints";

export default function GeneralFormAccordion() {
  const project = useAppSelector((state) => state.project);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <AccordionItem>
      <AccordionItemTitleWithButton
        p={2}
        label={
          <>
            <Flex align={"center"}>
              <Heading size={"sm"}>General</Heading>
              <ProgressPoints
                completeObject={GeneralFormEntries}
                params={project.params}
              />
            </Flex>
          </>
        }
      >
        <Button variant={"ghost"} size="sm" onClick={onOpen}>
          Reset ⟳
        </Button>
      </AccordionItemTitleWithButton>
      <AccordionPanel>
        <GeneralForm project={project} />
      </AccordionPanel>
      <ConfirmModal
        headerText={"Reset general form"}
        message={
          "Are you sure you want to reset the general from? It will delete all the provided data in it."
        }
        buttonLabel={"Reset general form"}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          dispatch(projectReset());
          onClose();
        }}
      />
    </AccordionItem>
  );
}

function GeneralForm({ project }: { project: Project }) {
  const dispatch = useDispatch();
  return (
    <Flex>
      <div>
        {Object.entries(GeneralFormEntries).map(([key, value]) => {
          return (
            <div key={key}>
              <Heading size="sm" my={2}>
                {key}
              </Heading>
              <RadioGroup
                value={
                  project.params
                    ? Number(project.params[key as keyof StockGeneralFormat])
                    : undefined
                }
              >
                <Stack>
                  {typeof value === "number" ? (
                    <NumberInputCustom
                      defaultValue={value}
                      min={0}
                      step={100}
                      onChange={(n) => {
                        const newParams = {
                          params: { ...project.params, [key]: Number(n) },
                        };
                        dispatch(projectUpdated(newParams));
                      }}
                    />
                  ) : (
                    Object.values(value)
                      .filter((v) => typeof v !== "number")
                      .map((data, index) => (
                        <Radio
                          colorScheme={"brand"}
                          key={index}
                          value={index}
                          onChange={() => {
                            const newParams = {
                              params: { ...project.params, [key]: index },
                            };
                            dispatch(projectUpdated(newParams));
                          }}
                          size="sm"
                        >
                          {data}
                        </Radio>
                      ))
                  )}
                </Stack>
              </RadioGroup>
            </div>
          );
        })}
      </div>
    </Flex>
  );
}

interface numberINputProps {
  defaultValue: number;
  min: number;
  step: number;
  onChange(valueAsString: string, valueAsNumber: number): void;
}

function NumberInputCustom({
  defaultValue,
  min,
  step,
  onChange,
}: numberINputProps) {
  return (
    <NumberInput
      defaultValue={defaultValue}
      min={min}
      step={step}
      onChange={onChange}
      size="sm"
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}
