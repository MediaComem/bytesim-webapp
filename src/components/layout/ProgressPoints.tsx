import { Flex } from "@chakra-ui/react";
import * as React from "react";

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
    completed = Object.keys(params).length;
  }
  const points = [];
  for (let i = 0; i < completed; i++) {
    points.push(<span key={i + 'completed'}>◉</span>);
  }
  for (let j = 0; j < total - completed; j++) {
    points.push(<span key={j + 'empty'}>◎</span>);
  }
  return <Flex mx={2} fontSize='xs' color={'gray.400'}>{points}</Flex>;
}
