import { Button } from "@chakra-ui/react";
import { css } from "@emotion/css";
import * as React from "react";
import { useDispatch } from "react-redux";
import { colorTheme } from "../..";
import {
  useCalculateAllRecommandations,
  useCalculateGenericRecommandations,
} from "../../app/hooks";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon_Active_MouseOver.svg";
import { recommandationsPopulated } from "../../features/recommandations/recommandationsSlice";
//import { useNavigate } from "react-router-dom";

export default function ReloadRecoButton() {
  const dispatch = useDispatch();
  const recosGeneric = useCalculateGenericRecommandations();
  const recos = useCalculateAllRecommandations();
  const reloadSimulation = React.useCallback(() => {
    dispatch(recommandationsPopulated([...recos, ...recosGeneric]));
  }, [dispatch, recos]);
  //const currentDisplayedRecos = useAppSelector((state) => state.recommandations);
  /*   const newRecos = React.useEffect(() => {
    if (recos.length !== currentDisplayedRecos.length) { return true }
  }, [recos, currentDisplayedRecos]); */

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
function recommandationsGeneric() {
  throw new Error("Function not implemented.");
}
