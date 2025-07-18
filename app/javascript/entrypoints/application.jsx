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
import DashboardSelector from "../components/DashboardSelector";
import LoginForm from "../components/LoginForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { FormatLineSpacingOutlined } from "@mui/icons-material";

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
    const companyName = headerRoot.dataset.companyName || "Your Company";

    let roles = {};
    if (loggedIn) {
      try {
        roles = JSON.parse(headerRoot.dataset.roles);
      } catch (e) {
        console.error("Failed to parse roles JSON:", e);
      }
    }

    renderWithToast(
      headerRoot,
      <AppHeader loggedIn={loggedIn} roles={roles} companyName={companyName} />
    );
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

    const employees = parseScriptJSON("employees-data");
    const fiscalYears = parseScriptJSON("fiscal-years-data");
    const fiscalYearEmployees = parseScriptJSON("fiscal-year-employees-data");
    const timeOffRequests = parseScriptJSON("time-off-requests-data");
    const supervisorsList = parseScriptJSON("supervisors-data");
    renderWithToast(
      dashboardRoot,
      <AdminDashboard
        employees={employees}
        fiscalYears={fiscalYears}
        fiscalYearEmployees={fiscalYearEmployees}
        timeOffRequests={timeOffRequests}
        supervisorsList={supervisorsList}
      />
    );
  }

  const resetRoot = document.getElementById("reset-password-root");
  if (resetRoot) {
    const resetUrl = resetRoot.dataset.resetUrl;
    const csrfToken = resetRoot.dataset.csrfToken;

    createRoot(resetRoot).render(
      <>
        <ResetPasswordForm resetUrl={resetUrl} csrfToken={csrfToken} />
        <ToastContainer position="top-center" />
      </>
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
        byDate={calendarData}
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

  const torFormRoot = document.getElementById("time-off-request-form");

  if (torFormRoot) {
    try {
      const parseJSON = (value, fallback = null) => {
        try {
          return JSON.parse(value);
        } catch (err) {
          console.error("Failed to parse JSON:", err, value);
          return fallback;
        }
      };

      const requestData = parseJSON(torFormRoot.dataset.request, {});
      const fiscalYearsData = parseJSON(torFormRoot.dataset.fiscalYears, []);
      const employeeId = parseInt(torFormRoot.dataset.employeeId, 10) || null;
      const supervisorId =
        parseInt(torFormRoot.dataset.supervisorId, 10) || null;
      const selectedFiscalYearId = parseInt(
        torFormRoot.dataset.selectedFiscalYearId,
        10
      );
      const fiscalYearEmployeeId = parseInt(
        torFormRoot.dataset.fiscalYearEmployeeId,
        10
      );
      const fiscalYearClosed = torFormRoot.dataset.fiscalYearClosed === "true";

      console.log({
        requestData,
        fiscalYearsData,
        selectedFiscalYearId,
        employeeId,
        supervisorId,
        fiscalYearEmployeeId,
        fiscalYearClosed,
      });

      if (requestData?.dates && !requestData.days) {
        requestData.days = requestData.dates.map((d) => ({
          date: d.date,
          amount: d.amount,
        }));
      }

      renderWithToast(
        torFormRoot,
        <TimeOffRequestForm
          request={requestData}
          fiscalYears={fiscalYearsData}
          initialFiscalYearId={selectedFiscalYearId}
          initialFiscalYearEmployeeId={fiscalYearEmployeeId}
          employeeId={employeeId}
          supervisorId={supervisorId}
          fiscalYearClosed={fiscalYearClosed}
        />
      );
    } catch (err) {
      console.error("Error mounting TimeOffRequestForm:", err);
      toast.error("Failed to load the form — please contact support.");
    }
  }

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
        console.error(`Failed to parse #${id}:`, err);
        return fallback;
      }
    };

    const request = parseScriptJSON("request-data");
    const supervisorId = parseScriptJSON("supervisor-id");
    const meta = parseScriptJSON("manage-request-meta");

    const redirectPath =
      meta?.redirect_path ||
      manageRoot.dataset.redirectPath ||
      `/supervisors/${supervisorId}`;

    const role = meta?.role || "supervisor";

    renderWithToast(
      manageRoot,
      <ManageRequest
        request={request}
        redirectPath={redirectPath}
        role={role}
      />
    );
  }

  const selectorRoot = document.getElementById("dashboard-selector");
  if (selectorRoot) {
    createRoot(selectorRoot).render(
      <>
        <DashboardSelector />
        <ToastContainer position="top-center" autoClose={3000} />
      </>
    );
  }

  const loginRoot = document.getElementById("login-root");
  if (loginRoot) {
    const loginUrl = loginRoot.dataset.loginUrl;
    const csrfToken = loginRoot.dataset.csrfToken;

    createRoot(loginRoot).render(
      <>
        <LoginForm loginUrl={loginUrl} csrfToken={csrfToken} />
        <ToastContainer position="top-center" />
      </>
    );
  }
});
