/*
Author: Matthew Heering
Description: Container component that displays one of three administrative views — Manage Employees, 
Manage Fiscal Years, or Fiscal Year Employees — based on which button is selected.
Date: 6/14/25 (Updated 6/15/25 to load embedded JSON from script tags)
*/

import React, { useState } from "react";
import { Box, Button, Stack, Paper } from "@mui/material";
import EmployeesTable from "./EmployeesTable";
import FiscalYearsTable from "./FiscalYearsTable";
import FiscalYearEmployeesTable from "./FiscalYearEmployeesTable";

// Helper function to parse embedded JSON safely
function getJSONFromScript(id) {
  const el = document.getElementById(id);
  if (!el) return [];
  try {
    return JSON.parse(el.textContent);
  } catch (err) {
    console.error(`Error parsing JSON for #${id}:`, err);
    return [];
  }
}

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("employees");

  // Load data once on first render
  const employees = getJSONFromScript("employees-data");
  const fiscalYears = getJSONFromScript("fiscal-years-data");
  const fiscalYearEmployees = getJSONFromScript("fiscal-year-employees-data");

  const renderActiveView = () => {
    switch (activeView) {
      case "fiscalYears":
        return <FiscalYearsTable fiscalYears={fiscalYears} />;
      case "fiscalYearEmployees":
        return (
          <FiscalYearEmployeesTable
            fiscalYearEmployees={fiscalYearEmployees}
            fiscalYears={fiscalYears}
          />
        );
      case "employees":
      default:
        return <EmployeesTable employees={employees} />;
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginBottom: 3 }}>
        <Button
          variant={activeView === "employees" ? "contained" : "outlined"}
          onClick={() => setActiveView("employees")}
        >
          Manage Employees
        </Button>
        <Button
          variant={activeView === "fiscalYears" ? "contained" : "outlined"}
          onClick={() => setActiveView("fiscalYears")}
        >
          Manage Fiscal Years
        </Button>
        <Button
          variant={activeView === "fiscalYearEmployees" ? "contained" : "outlined"}
          onClick={() => setActiveView("fiscalYearEmployees")}
        >
          Fiscal Year Employees
        </Button>
      </Stack>

      {/* Main Content */}
      <Paper elevation={3} sx={{ padding: 3 }}>
        {renderActiveView()}
      </Paper>
    </Box>
  );
}