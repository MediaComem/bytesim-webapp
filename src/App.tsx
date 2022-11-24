import "./App.css";
import { css } from "@emotion/css";
import BytesimeHeader from "./components/layout/ByteSimHeader";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ReportExportTemplate from "./components/recommandations/ReportExportTemplate";
import RightClickMenu from "./components/layout/RightClickMenu";

function App() {
  return (
    <HashRouter basename="/">
      <div
        className={
          "App " +
          css({
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
          })
        }
      >
        <RightClickMenu />
        <BytesimeHeader />
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="export" element={<ReportExportTemplate />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
