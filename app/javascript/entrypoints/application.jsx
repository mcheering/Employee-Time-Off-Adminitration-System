/*
Author: Matthew Heering
Description: React entrypoint for rendering employee-related components, including
tables for employees, supervisors, administrators, a form, and a show view.
Date: 6/14/25
*/
import React from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import ManageRequest from "../components/ManageRequest";

document.addEventListener("DOMContentLoaded", () => {
  const renderWithToast = (element, component) => {
    createRoot(element).render(
      <>
        {component}
        <ToastContainer position="top-center" autoClose={3000} />
      </>
    );
  };

  const headerRoot = document.getElementById("react-layout-header");
  if (headerRoot) {
    const loggedIn = headerRoot.dataset.loggedIn === "true";
    renderWithToast(headerRoot, <AppHeader loggedIn={loggedIn} />);
  }

  const tableRoot = document.getElementById("employees-react-table");
  if (tableRoot) {
    const data = JSON.parse(
      tableRoot.dataset.employees.replaceAll("&quot;", '"')
    );
    renderWithToast(tableRoot, <EmployeesTable employees={data} />);
  }

  const formRoot = document.getElementById("new-employee-form");
  if (formRoot) {
    const parsedEmployee = formRoot.dataset.employee
      ? JSON.parse(formRoot.dataset.employee.replaceAll("&quot;", '"'))
      : null;

    const parsedSupervisors = formRoot.dataset.supervisors
      ? JSON.parse(formRoot.dataset.supervisors.replaceAll("&quot;", '"'))
      : [];

    renderWithToast(
      formRoot,
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
    renderWithToast(showRoot, <EmployeeShow employee={data} />);
  }

  const supervisorRoot = document.getElementById("supervisors-react-table");
  if (supervisorRoot) {
    const data = JSON.parse(
      supervisorRoot.dataset.supervisors.replaceAll("&quot;", '"')
    );
    renderWithToast(supervisorRoot, <SupervisorsTable supervisors={data} />);
  }

  const adminRoot = document.getElementById("administrators-react-table");
  if (adminRoot) {
    const data = JSON.parse(
      adminRoot.dataset.administrators.replaceAll("&quot;", '"')
    );
    renderWithToast(adminRoot, <AdministratorsTable administrators={data} />);
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

    renderWithToast(
      dashboardRoot,
      <AdminDashboard
        employees={parseScriptJSON("employees-data")}
        fiscalYears={parseScriptJSON("fiscal-years-data")}
        fiscalYearEmployees={parseScriptJSON("fiscal-year-employees-data")}
      />
    );
  }

  const supRoot = document.getElementById("supervisor-dashboard");

  if (supRoot) {
    const parseScriptJSON = (id, fallback = null) => {
      const el = document.getElementById(id);
      if (!el) {
        console.warn(`⚠️ Missing element: #${id}`);
        return fallback;
      }
      try {
        const data = JSON.parse(el.textContent);
        return data;
      } catch (err) {
        console.error(`❌ Failed to parse #${id}:`, err);
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
    const calendarData = parseScriptJSON("calendar-data", {});

    renderWithToast(
      supRoot,
      <SupervisorDashboard
        supervisor={supervisor}
        fiscalYears={fiscalYears}
        selectedFy={selectedFy}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        timeOffRequests={timeOffRequests}
        byDate={byDate}
        fyeRecords={fyeRecords}
        calendarData={calendarData}
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

    const employeeId = parseInt(employeeDashRoot.dataset.employeeId, 10);
    const employeeName = employeeDashRoot.dataset.employeeName;
    renderWithToast(
      employeeDashRoot,
      <EmployeeDashboard
        requestsData={parseScriptJSON("employee-requests-data", [])}
        fiscalYearsData={parseScriptJSON("fiscal-years-data", [])}
        summaryData={parseScriptJSON("employee-summary-data", {})}
        employeeId={employeeId}
        employeeName={employeeName}
      />
    );
  }

  setTimeout(() => {
    const torFormRoot = document.getElementById("time-off-request-form");
    if (torFormRoot) {
      try {
        const requestData = JSON.parse(torFormRoot.dataset.request);
        const fiscalYearsData = JSON.parse(torFormRoot.dataset.fiscalYears);
        const employeeId = parseInt(torFormRoot.dataset.employeeId, 10);
        const supervisorId = parseInt(torFormRoot.dataset.supervisorId, 10);

        if (requestData?.dates && !requestData.days) {
          requestData.days = requestData.dates.map((d) => ({
            date: d.date,
            amount: d.amount,
          }));
        }

        const fiscalYearEmployeeId = parseInt(
          torFormRoot.dataset.fiscalYearEmployeeId,
          10
        );

        renderWithToast(
          torFormRoot,
          <TimeOffRequestForm
            request={requestData}
            fiscalYears={fiscalYearsData}
            employeeId={employeeId}
            fiscalYearEmployeeId={fiscalYearEmployeeId}
            supervisorId={supervisorId}
          />
        );
      } catch (err) {
        console.error("❌ Error parsing or rendering:", err);
      }
    }
  }, 500);

  const viewRoot = document.getElementById("time-off-request-view");
  if (viewRoot) {
    const request = JSON.parse(
      viewRoot.dataset.request.replaceAll("&quot;", '"')
    );
    const employeeId = parseInt(viewRoot.dataset.employeeId, 10);

    renderWithToast(
      viewRoot,
      <TimeOffRequestView request={request} employeeId={employeeId} />
    );
  }

  const manageRoot = document.getElementById("supervisor-manage-request");

  if (manageRoot) {
    const parseScriptJSON = (id, fallback = null) => {
      const el = document.getElementById(id);
      if (!el) return fallback;
      try {
        return JSON.parse(el.textContent);
      } catch (err) {
        console.error(`❌ Failed to parse #${id}:`, err);
        return fallback;
      }
    };

    const request = parseScriptJSON("request-data");
    const supervisorId = parseScriptJSON("supervisor-id");

    renderWithToast(
      manageRoot,
      <ManageRequest request={request} supervisorId={supervisorId} />
    );
  }
});
