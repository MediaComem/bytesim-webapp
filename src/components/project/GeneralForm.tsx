import {
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
  projectParamsUpdated,
} from "../../features/project/projectSlice";
import AccordionItemTitleCustom from "../layout/AccordionItemTitleCustom";
import CustomModal, { confirmText } from "../layout/CustomModal";
import ProgressPoints from "../layout/ProgressPoints";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon.svg";
import { css } from "@emotion/css";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import { colorTheme } from "../../theme";

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
      <Box px={"4"} mt={"-2"}>
        {Object.entries(GeneralFormEntries).map(([key, data]) => {
          return (
            <div key={key}>
              <Heading fontWeight={"bold"} fontSize={12} mt={2} mb={1}>
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
                    dispatch(projectParamsUpdated(newParams));
                  }}
                  disableEdition={project.status === "SIMULATION"}
                />
              )}
              {typeof data !== "number" &&
                Object.values(data)
                  .filter((v) => typeof v !== "number")
                  .map((data, index) => {
                    return (
                      <Flex key={index} gap={1} fontSize={12}>
                        <input
                          type="radio"
                          id={`${key}_${data}`}
                          checked={
                            project.params &&
                            project.params[key as keyof GenericParameters] ===
                              data
                          }
                          onChange={() => {
                            const newParams = {
                              params: { ...project.params, [key]: data },
                            };
                            dispatch(projectParamsUpdated(newParams));
                          }}
                          className={css({ accentColor: `${colorTheme[500]}` })}
                        />
                        <label htmlFor={`${key}_${data}`}>
                          {data as string}
                        </label>
                      </Flex>
                    );
                  })}
            </div>
          );
        })}
      </Box>
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
