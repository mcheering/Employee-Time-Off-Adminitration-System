// Author: Matthew Heering
// Description: Admin dashboard with tabs for employees, fiscal years, fiscal year employees, and time-off requests
// Date: 7/2/25 (Updated: with lifted fiscalYears state)

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Box, Stack, Button, Paper, Typography } from "@mui/material";
import EmployeeShow from "./EmployeeShow";
import EmployeesTable from "./EmployeesTable";
import FiscalYearsTable from "./FiscalYearsTable";
import FiscalYearEmployeesTable from "./FiscalYearEmployeesTable";
import TimeOffRequestsView from "./TimeOffRequestsView";
import NewEmployeeForm from "./NewEmployeeForm";

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
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [employees] = useState(getJSONFromScript("employees-data"));
  const [fiscalYears, setFiscalYears] = useState(
    getJSONFromScript("fiscal-years-data")
  );
  const [fiscalYearEmployees] = useState(
    getJSONFromScript("fiscal-year-employees-data")
  );
  const [timeOffRequests] = useState(
    getJSONFromScript("time-off-requests-data")
  );
  const [supervisorsList] = useState(getJSONFromScript("supervisors-data"));

  useEffect(() => {
    const el = document.getElementById("admin-ready-requests");
    if (!el) return;

    let readyRequests = [];
    try {
      readyRequests = JSON.parse(el.textContent);
    } catch (err) {
      console.error("Failed to parse admin ready requests:", err);
      return;
    }

    readyRequests.forEach((req) => {
      toast.info(
        <span>
          Request from <strong>{req.employee_name}</strong> under{" "}
          <strong>{req.supervisor_name}</strong> is ready for your review.{" "}
          <a href={req.edit_path}>Review now</a>
        </span>,
        { autoClose: false }
      );
    });
  }, []);

  const renderActiveView = () => {
    if (editingEmployee) {
      return (
        <NewEmployeeForm
          employee={editingEmployee}
          supervisors={supervisorsList}
          onSave={() => {
            setEditingEmployee(null);
            setSelectedEmployee(null);
          }}
        />
      );
    }

    if (selectedEmployee) {
      return (
        <EmployeeShow
          employee={selectedEmployee}
          onEdit={() => {
            setEditingEmployee(selectedEmployee);
            setSelectedEmployee(null);
          }}
          onBack={() => setSelectedEmployee(null)}
        />
      );
    }

    switch (activeView) {
      case "fiscalYears":
        return (
          <FiscalYearsTable
            fiscalYears={fiscalYears}
            setFiscalYears={setFiscalYears}
          />
        );

      case "fiscalYearEmployees":
        return (
          <FiscalYearEmployeesTable
            fiscalYearEmployees={fiscalYearEmployees}
            fiscalYears={fiscalYears}
            onManage={(fye) => {
              const emp = employees.find((e) => e.id === fye.employee_id);
              if (emp) {
                setSelectedEmployee(emp);
              } else {
                console.error("Employee not found for id", fye.employee_id);
              }
            }}
          />
        );

      case "timeOffs":
        return (
          <TimeOffRequestsView
            timeOffRequests={timeOffRequests}
            supervisor={{ first_name: "Admin", last_name: "" }}
            fiscalYears={fiscalYears}
            selectedFy={null}
            statusOptions={[]}
            selectedStatus={null}
            supervisorsList={supervisorsList}
            role="admin"
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
