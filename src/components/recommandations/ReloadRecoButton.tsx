import { Button } from "@chakra-ui/react";
import { css } from "@emotion/css";
import * as React from "react";
import { useDispatch } from "react-redux";
import {
  useCalculateAllRecommandations,
  useCalculateGenericRecommandations,
} from "../../app/hooks";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon.svg";
import { recommandationsPopulated } from "../../features/recommandations/recommandationsSlice";
import { colorTheme } from "../../theme";

export default function ReloadRecoButton() {
  const dispatch = useDispatch();
  const recosGeneric = useCalculateGenericRecommandations();
  const recos = useCalculateAllRecommandations();
  const reloadSimulation = React.useCallback(() => {
    dispatch(recommandationsPopulated([...recosGeneric, ...recos]));
  }, [dispatch, recos]);

  return (
    <>
      {/* <div>{currentDisplayedRecos.length} {recos.length} {newRecos}</div> */}
      <Button
        variant={"outline"}
        colorScheme="brand"
        alignSelf={"center"}
        justifySelf={"flex-end"}
        //disabled = {!newRecos}
        onClick={reloadSimulation}
        size="sm"
      >
        Reload
        <ResetIcon
          className={css({ margin: "3px" })}
          stroke={colorTheme[400]}
        />
      </Button>
    </>
  );
}
