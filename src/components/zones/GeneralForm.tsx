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
  GenericParameters,
} from "../../app/types/generalFormTypes";
import { Project } from "../../app/types/types";
import {
  projectReset,
  projectUpdated,
} from "../../features/project/projectSlice";
import AccordionItemTitleWithButton from "../layout/AccordionItemTitleWithButton";
import ConfirmModal from "../layout/ConfirmModal";
import ProgressPoints from "../layout/ProgressPoints";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon_Active_MouseOver.svg";
import { css } from "@emotion/css";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";

export default function GeneralFormAccordion() {
  const project = useAppSelector((state) => state.project);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionItemTitleWithButton
            p={2}
            label={
              <>
                <Flex align={"center"}>
                  <AccordionCustomTitle label='General' icon="settings" />
                  <ProgressPoints
                    completeObject={GeneralFormEntries}
                    params={project.params}
                  />
                </Flex>
              </>
            }
            isExpanded={isExpanded}
          >
            <Button
              variant={"ghost"}
              size="sm"
              onClick={onOpen}
              disabled={project.status === "SIMULATION"}
            >
              Reset <ResetIcon className={css({ margin: "3px" })} />
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
        </>
      )}
    </AccordionItem>
  );
}

function GeneralForm({ project }: { project: Project }) {
  const dispatch = useDispatch();
  return (
    <Flex>
      <div>
        {Object.entries(GeneralFormEntries).map(([key, data]) => {
          return (
            <div key={key}>
              <Heading size="sm" my={2}>
                {key}
              </Heading>
              {typeof data === "number" && (
                <NumberInputCustom
                  defaultValue={0}
                  value={
                    project.params
                      ? Number(project.params[key as keyof GenericParameters])
                      : undefined
                  }
                  min={0}
                  step={100}
                  onChange={(n) => {
                    const newParams = {
                      params: { ...project.params, [key]: Number(n) },
                    };
                    dispatch(projectUpdated(newParams));
                  }}
                  disableEdition={project.status === "SIMULATION"}
                />
              )}
              <RadioGroup
                value={
                  project.params
                    ? String(project.params[key as keyof GenericParameters])
                    : undefined
                }
                isDisabled={project.status === "SIMULATION"}
              >
                <Stack>
                  {typeof data !== "number" &&
                    Object.values(data)
                      .filter((v) => typeof v !== "number")
                      .map((data, index) => (
                        <Radio
                          colorScheme={"brand"}
                          key={index}
                          value={data}
                          onChange={() => {
                            const newParams = {
                              params: { ...project.params, [key]: data },
                            };
                            dispatch(projectUpdated(newParams));
                          }}
                          size="sm"
                        >
                          {data}
                        </Radio>
                      ))}
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
  value?: number;
  min: number;
  step: number;
  onChange(valueAsString: string, valueAsNumber: number): void;
  disableEdition?: boolean;
}

function NumberInputCustom({
  defaultValue,
  value,
  min,
  step,
  onChange,
  disableEdition,
}: numberINputProps) {
  return (
    <NumberInput
      defaultValue={defaultValue}
      min={min}
      step={step}
      onChange={onChange}
      size="sm"
      isDisabled={disableEdition}
      value={value}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}
