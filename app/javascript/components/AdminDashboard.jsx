//Author: Matthew Heering
//Description: Admin dashboard with tabs for employees, fiscal years, fiscal year employees, and time-off requests
//Date: 7/2/25

import React, { useState } from "react";
import { Box, Stack, Button, Paper, Typography } from "@mui/material";
import EmployeeShow from "./EmployeeShow";
import EmployeesTable from "./EmployeesTable";
import FiscalYearsTable from "./FiscalYearsTable";
import FiscalYearEmployeesTable from "./FiscalYearEmployeesTable";
import TimeOffRequestsView from "./TimeOffRequestsView";

function getJSONFromScript(id, fallback = []) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  try {
    return JSON.parse(el.textContent);
  } catch (err) {
    console.error(`Error parsing JSON for #${id}:`, err);
    return fallback;
  }
}

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("employees");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Load once
  const employees = getJSONFromScript("employees-data");
  const fiscalYears = getJSONFromScript("fiscal-years-data");
  const fiscalYearEmployees = getJSONFromScript("fiscal-year-employees-data");
  const timeOffRequests = getJSONFromScript("time-off-requests-data");

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

      case "timeOffs":
        return (
          <TimeOffRequestsView
            timeOffRequests={timeOffRequests}
            supervisor={{ first_name: "Admin", last_name: "" }} // 👈 Customize if desired
            fiscalYears={fiscalYears}
            selectedFy={null}
            statusOptions={[]} // adjust as needed
            selectedStatus={null}
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
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Admin Dashboard
      </Typography>

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

          <Button
            variant={activeView === "timeOffs" ? "contained" : "outlined"}
            onClick={() => setActiveView("timeOffs")}
          >
            Manage Employee Time-Offs
          </Button>
        </Stack>
      )}

      <Paper elevation={3} sx={{ padding: 3 }}>
        {renderActiveView()}
      </Paper>
    </Box>
  );
}
