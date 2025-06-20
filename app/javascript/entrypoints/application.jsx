/*
Author: Matthew Heering
Description: React entrypoint for rendering employee-related components, including
tables for employees, supervisors, administrators, a form, and a show view.
Date: 6/14/25
*/
import React from "react";
import { createRoot } from "react-dom/client";

import AppHeader from "../components/AppHeader";
import EmployeesTable from "../components/EmployeesTable";
import NewEmployeeForm from "../components/NewEmployeeForm";
import EmployeeShow from "../components/EmployeeShow";
import SupervisorsTable from "../components/SupervisorsTable";
import AdministratorsTable from "../components/AdministratorsTable";
import AdminDashboard from "../components/AdminDashboard";

document.addEventListener("DOMContentLoaded", () => {
  const headerRoot = document.getElementById("react-layout-header");
  if (headerRoot) {
    const loggedIn = headerRoot.dataset.loggedIn === "true";
    createRoot(headerRoot).render(<AppHeader loggedIn={loggedIn} />);
  }

  const tableRoot = document.getElementById("employees-react-table");
  if (tableRoot) {
    const data = JSON.parse(
      tableRoot.dataset.employees.replaceAll("&quot;", '"')
    );
    createRoot(tableRoot).render(<EmployeesTable employees={data} />);
  }

  const formRoot = document.getElementById("new-employee-form");
  if (formRoot) {
    const employeeData = formRoot.dataset.employee;
    const parsedEmployee = employeeData
      ? JSON.parse(employeeData.replaceAll("&quot;", '"'))
      : null;

    const supervisorsData = formRoot.dataset.supervisors;
    const parsedSupervisors = supervisorsData
      ? JSON.parse(supervisorsData.replaceAll("&quot;", '"'))
      : [];

    createRoot(formRoot).render(
      <NewEmployeeForm
        employee={parsedEmployee}
        supervisors={parsedSupervisors}
      />
    );
  }

  const showRoot = document.getElementById("employee-react-show");
  if (showRoot) {
    const data = JSON.parse(
      showRoot.dataset.employee.replaceAll("&quot;", '"')
    );
    createRoot(showRoot).render(<EmployeeShow employee={data} />);
  }

  const supervisorRoot = document.getElementById("supervisors-react-table");
  if (supervisorRoot) {
    const data = JSON.parse(
      supervisorRoot.dataset.supervisors.replaceAll("&quot;", '"')
    );
    createRoot(supervisorRoot).render(<SupervisorsTable supervisors={data} />);
  }

  const adminRoot = document.getElementById("administrators-react-table");
  if (adminRoot) {
    const data = JSON.parse(
      adminRoot.dataset.administrators.replaceAll("&quot;", '"')
    );
    createRoot(adminRoot).render(<AdministratorsTable administrators={data} />);
  }

  const dashboardRoot = document.getElementById("admin-dashboard");
  if (dashboardRoot) {
    const parseScriptJSON = (id) => {
      const el = document.getElementById(id);
      if (!el) return [];
      try {
        return JSON.parse(el.textContent);
      } catch (err) {
        console.error(`Failed to parse #${id}:`, err);
        return [];
      }
    };

    const employees = parseScriptJSON("employees-data");
    const fiscalYears = parseScriptJSON("fiscal-years-data");
    const fiscalYearEmployees = parseScriptJSON("fiscal-year-employees-data");

    createRoot(dashboardRoot).render(
      <AdminDashboard
        employees={employees}
        fiscalYears={fiscalYears}
        fiscalYearEmployees={fiscalYearEmployees}
      />
    );
  }
});
