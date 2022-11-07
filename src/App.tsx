import "./App.css";
import { css } from "@emotion/css";
import BytesimeHeader from "./components/layout/ByteSimHeader";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ReportExportTemplate from "./components/recommandations/ReportExportTemplate";

function App() {
  return (
    <BrowserRouter>
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
        <BytesimeHeader />
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="export" element={<ReportExportTemplate />} />
          <Route
            path="bytesim-webapp/export"
            element={<ReportExportTemplate />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
