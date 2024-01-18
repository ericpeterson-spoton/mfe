import "./styles/styles.css";
import "./index.css";

import Reports from "./components/Reports";
import Report from "./components/Report";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { BASE_URL } from "./constants";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MainApp />
    </LocalizationProvider>
  );
}

function MainApp() {
  return (
    <BrowserRouter basename={`${BASE_URL}`}>
      <Routes>
        <Route path="/" element={<Reports />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="reports" element={<Reports />} />
        <Route path="create-report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
