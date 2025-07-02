//Author: Matthew Heering
//Description: Component that renders the admin dashboard, showing the admin all employees, ablility to add employees, add fiscal years, and view employees by fiscal year
//Date:7/2/25
import React, { useState } from "react";
import { Box, Stack, Button, Paper } from "@mui/material";
import EmployeeShow from "./EmployeeShow";
import EmployeesTable from "./EmployeesTable";
import FiscalYearsTable from "./FiscalYearsTable";
import FiscalYearEmployeesTable from "./FiscalYearEmployeesTable";

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
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = getJSONFromScript("employees-data");
  const fiscalYears = getJSONFromScript("fiscal-years-data");
  const fiscalYearEmployees = getJSONFromScript("fiscal-year-employees-data");

  const renderActiveView = () => {
    if (selectedEmployee) {
      return (
        <EmployeeShow
          employee={selectedEmployee}
          onBack={() => setSelectedEmployee(null)}
        />
      );
    }

    switch (activeView) {
      case "fiscalYears":
        return <FiscalYearsTable fiscalYears={fiscalYears} />;
      case "fiscalYearEmployees":
        return (
          <FiscalYearEmployeesTable
            fiscalYearEmployees={fiscalYearEmployees}
            fiscalYears={fiscalYears}
            onManage={(emp) => setSelectedEmployee(emp)}
          />
        );
      case "employees":
      default:
        return (
          <EmployeesTable
            employees={employees}
            onManage={(emp) => setSelectedEmployee(emp)}
          />
        );
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {!selectedEmployee && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ marginBottom: 3 }}
        >
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
            variant={
              activeView === "fiscalYearEmployees" ? "contained" : "outlined"
            }
            onClick={() => setActiveView("fiscalYearEmployees")}
          >
            Fiscal Year Employees
          </Button>
        </Stack>
      )}

      <Paper elevation={3} sx={{ padding: 3 }}>
        {renderActiveView()}
      </Paper>
    </Box>
  );
}
