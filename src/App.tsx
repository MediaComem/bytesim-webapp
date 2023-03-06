import "./App.css";
import { css } from "@emotion/css";
import BytesimeHeader from "./components/layout/ByteSimHeader";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ReportExportTemplate from "./components/recommandations/ReportExportTemplate";
import RightClickMenu from "./components/layout/RightClickMenu";
import BestPracticesPage from "./components/recommandations/BestPracticesPage";
import About from "./components/about/About";
import { Box } from "@chakra-ui/react";

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
          <Route path="best-practices" element={<BestPracticesPage />} />
        </Routes>
        <Box boxShadow='lg' border='1px' borderColor='gray.200' borderRadius="20" bg="white" px="3" pb="1" style={{ position: "fixed", bottom: "40px", right: "40px" }}>
          <About></About>
        </Box >
      </div>
    </HashRouter>
  );
}

export default App;
