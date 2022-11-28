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
  getGeneralEntryLabel,
} from "../../app/types/generalFormTypes";
import { Project } from "../../app/types/types";
import {
  projectReset,
  projectUpdated,
} from "../../features/project/projectSlice";
import AccordionItemTitleCustom from "../layout/AccordionItemTitleCustom";
import CustomModal, { confirmText } from "../layout/CustomModal";
import ProgressPoints from "../layout/ProgressPoints";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon_Active_MouseOver.svg";
import { css } from "@emotion/css";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";

export default function GeneralFormAccordion() {
  const project = useAppSelector((state) => state.project);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <AccordionItem borderTop={"none"}>
      {({ isExpanded }) => (
        <>
          <AccordionItemTitleCustom
            p={2}
            label={
              <>
                <Flex align={"center"}>
                  <AccordionCustomTitle label="General" icon="settings" />
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
              Reset{" "}
              <ResetIcon className={css({ margin: "3px" })} stroke="black" />
            </Button>
          </AccordionItemTitleCustom>
          <AccordionPanel>
            <GeneralForm project={project} />
          </AccordionPanel>
          <CustomModal
            texts={confirmText.resetGeneral}
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
                {getGeneralEntryLabel(key)}
              </Heading>
              {typeof data === "number" && (
                <NumberInputCustom
                  defaultValue={1000}
                  value={
                    project.params &&
                    project.params[key as keyof GenericParameters]
                      ? Number(project.params[key as keyof GenericParameters])
                      : 1000
                  }
                  min={1}
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
