import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as ExportIcon } from "../../assets/Export.svg";
import { getImageDimensions } from "../../features/importImage/utils";
import ButtonWithIconCustom from "../layout/ButtonWithIconCustom";

export default function ExportButton() {
  const { search } = useLocation(); // keep image params
  const navigate = useNavigate();
  return (
    <>
      <ButtonWithIconCustom
        icon={<ExportIcon />}
        label={"Export"}
        variant={"ghost"}
        iconAfter={false}
        onClick={() => {
          localStorage.setItem(
            "imgWidth",
            getImageDimensions()?.width?.toString() || ""
          );
          navigate(`/export${search}`); // keep url params
        }}
      />
    </>
  );
}
