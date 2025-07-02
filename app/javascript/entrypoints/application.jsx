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
import SupervisorDashboard from "../components/SupervisorDashboard";
import EmployeeDashboard from "../components/EmployeeDashboard";
import TimeOffRequestForm from "../components/TimeOffRequestForm";
import TimeOffRequestView from "../components/TimeOffRequestView";

console.log("✅ application.jsx is loading");

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

  const supRoot = document.getElementById("supervisor-dashboard");
  if (supRoot) {
    const parseScriptJSON = (id, fallback = null) => {
      const el = document.getElementById(id);
      if (!el) return fallback;
      try {
        return JSON.parse(el.textContent);
      } catch (err) {
        console.error(`Failed to parse #${id}:`, err);
        return fallback;
      }
    };

    const supervisor = parseScriptJSON("supervisor-data");
    const fiscalYears = parseScriptJSON("fiscal-years-data", []);
    const selectedFy = parseScriptJSON("selected-fy");
    const statusOptions = parseScriptJSON("status-options", []);
    const selectedStatus = parseScriptJSON("selected-status", "");
    const timeOffRequests = parseScriptJSON("time-off-requests", []);
    const byDate = parseScriptJSON("by-date", {});
    const fyeRecords = parseScriptJSON("fye-records", []);

    createRoot(supRoot).render(
      <SupervisorDashboard
        supervisor={supervisor}
        fiscalYears={fiscalYears}
        selectedFy={selectedFy}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        timeOffRequests={timeOffRequests}
        byDate={byDate}
        fyeRecords={fyeRecords}
      />
    );
  }

  const employeeDashRoot = document.getElementById("employee-dashboard");
  if (employeeDashRoot) {
    const parseScriptJSON = (id, fallback = null) => {
      const el = document.getElementById(id);
      if (!el) return fallback;
      try {
        return JSON.parse(el.textContent);
      } catch (err) {
        console.error(`Failed to parse #${id}:`, err);
        return fallback;
      }
    };

    const requestsData = parseScriptJSON("employee-requests-data", []);
    const fiscalYearsData = parseScriptJSON("fiscal-years-data", []);
    const summaryData = parseScriptJSON("employee-summary-data", {});
    const employeeId = parseInt(employeeDashRoot.dataset.employeeId, 10);

    createRoot(employeeDashRoot).render(
      <EmployeeDashboard
        requestsData={requestsData}
        fiscalYearsData={fiscalYearsData}
        summaryData={summaryData}
        employeeId={employeeId}
      />
    );
  }

  setTimeout(() => {
    const torFormRoot = document.getElementById("time-off-request-form");
    console.log("🕵️ Inside timeout, got:", torFormRoot);

    if (torFormRoot) {
      try {
        const requestData = JSON.parse(torFormRoot.dataset.request);
        const fiscalYearsData = JSON.parse(torFormRoot.dataset.fiscalYears);
        const employeeId = parseInt(torFormRoot.dataset.employeeId, 10);

        console.log("📊 Parsed:", { requestData, fiscalYearsData, employeeId });

        createRoot(torFormRoot).render(
          <TimeOffRequestForm
            request={requestData}
            fiscalYears={fiscalYearsData}
            employeeId={employeeId}
          />
        );
      } catch (err) {
        console.error("❌ Error parsing or rendering:", err);
      }
    } else {
      console.warn("⚠️ No #time-off-request-form found");
    }
  }, 500); // Wait a bit for DOM to fully load

  const viewRoot = document.getElementById("time-off-request-view");
  if (viewRoot) {
    const request = JSON.parse(
      viewRoot.dataset.request.replaceAll("&quot;", '"')
    );
    const employeeId = parseInt(viewRoot.dataset.employeeId, 10);

    createRoot(viewRoot).render(
      <TimeOffRequestView request={request} employeeId={employeeId} />
    );
  }
});
