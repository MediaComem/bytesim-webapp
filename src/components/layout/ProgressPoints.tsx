import { Flex } from "@chakra-ui/react";
import * as React from "react";
import { ReactComponent as TickIcon } from "../../assets/Tick.svg";

//! To be removed if the points are not used anymore
// import { ReactComponent as EmptyPointIcon } from "../../assets/RondCompletion_NonComplete.svg";
// import { ReactComponent as FullPointIcon } from "../../assets/RondCompletion_complete.svg";

interface ProgressPointsProps {
  completeObject: Object;
  params?: Record<string, any>;
  color?: string;
  icon?: React.ReactNode;
}
export default function ProgressPoints({
  completeObject,
  params,
}: ProgressPointsProps) {
  const total = Object.keys(completeObject).length;
  let completed = 0;
  if (params) {
    Object.values(params).forEach((param) => {
      if (param !== undefined) {
        completed++;
      }
    });
  }

  //! To be removed if the points are not used anymore
  /*const points = [];
  for (let i = 0; i < completed; i++) {
    points.push(
      <span key={i + "completed"}>
        <FullPointIcon />
      </span>
    );
  }
  for (let j = 0; j < total - completed; j++) {
    points.push(
      <span key={j + "empty"}>
        <EmptyPointIcon />
      </span>
    );
  }*/
  return (
    <Flex
      mx={2}
      fontSize="sm"
      color={completed < total ? "red.600" : "green.500"}
    >
      {/* <Flex mx={2} fontSize="xs" color={"gray.400"}> */}
      {/* {points} */}
      {completed < total ? (
        <span>
          {completed}/{total}
        </span>
      ) : (
        <TickIcon />
      )}
    </Flex>
  );
}
