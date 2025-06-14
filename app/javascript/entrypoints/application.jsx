import React from "react";
import { createRoot } from "react-dom/client";
import EmployeesTable from "../components/EmployeesTable";
import NewEmployeeForm from "../components/NewEmployeeForm";

document.addEventListener("DOMContentLoaded", () => {
  const tableRoot = document.getElementById("employees-react-table");
  if (tableRoot) {
    const data = JSON.parse(tableRoot.dataset.employees.replaceAll('&quot;', '"'));
    createRoot(tableRoot).render(<EmployeesTable employees={data} />);
  }

  const formRoot = document.getElementById("new-employee-form");
  if (formRoot) {
    createRoot(formRoot).render(<NewEmployeeForm />);
  }
});