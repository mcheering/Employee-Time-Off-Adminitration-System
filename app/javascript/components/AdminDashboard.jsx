/*
Author: Matthew Heering
Description: Container component that displays one of three administrative views — Manage Employees, 
Manage Fiscal Years, or Fiscal Year Employees — based on which button is selected.
Date: 6/14/25
*/

import React, { useState } from "react";
import { Box, Button, Stack, Paper } from "@mui/material";
import EmployeesTable from "./EmployeesTable";
import FiscalYearsTable from "./FiscalYearsTable";
import FiscalYearEmployeesTable from "./FiscalYearEmployeesTable";

export default function AdminDashboard({ employees, fiscalYears, fiscalYearEmployees }) {
  const [activeView, setActiveView] = useState("employees");

  const renderActiveView = () => {
    switch (activeView) {
      case "fiscalYears":
        return <FiscalYearsTable fiscalYears={fiscalYears} />;
      case "fiscalYearEmployees":
        return <FiscalYearEmployeesTable fiscalYearEmployees={fiscalYearEmployees} />;
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