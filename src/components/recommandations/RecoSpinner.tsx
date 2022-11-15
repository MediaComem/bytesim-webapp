import { Flex, Spinner } from "@chakra-ui/react";
import { useAppSelector } from "../../app/hooks";
import { useFlashEffect } from "../../hooks/useFlash";
import usePrev from "../../hooks/usePrev";
import { areArraysEqual } from "../../services/utils";

const RecoSpinner = () => {
  const recos = useAppSelector((state) => state.recommandations);
  const prevRecos = usePrev(recos) ?? [];
  const areRecosEqual = areArraysEqual(recos, prevRecos);

  const recoUpdated = useFlashEffect(areRecosEqual, { timeout: 200 });
  if (!recoUpdated) return null;
  return (
    <Flex flex={1} justifySelf="flex-start" pl={2}>
      <Spinner size="sm"></Spinner>
    </Flex>
  );
};
export default RecoSpinner;
