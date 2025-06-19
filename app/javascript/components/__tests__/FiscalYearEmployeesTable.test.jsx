/*
Author: Matthew Heering
Description: Component testing to make sure the fiscal year employee table renders correctly. 
Date: 6/18/25
*/
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FiscalYearEmployeesTable from "../FiscalYearEmployeesTable";

const fiscalYears = [
  { id: 1, start_date: "2024-01-01", end_date: "2024-12-31" },
  { id: 2, start_date: "2025-01-01", end_date: "2025-12-31" },
];

const fiscalYearEmployees = [
  {
    id: 1,
    employee_name: "Alice Smith",
    earned_vacation_days: 10,
    allotted_pto_days: 5,
    fiscal_year_id: 1,
    employee_id: 1,
  },
  {
    id: 2,
    employee_name: "Bob Johnson",
    earned_vacation_days: 15,
    allotted_pto_days: 7,
    fiscal_year_id: 2,
    employee_id: 2,
  },
];

describe("FiscalYearEmployeesTable Component", () => {
  beforeEach(() => {
    render(
      <FiscalYearEmployeesTable
        fiscalYears={fiscalYears}
        fiscalYearEmployees={fiscalYearEmployees}
      />
    );
  });

  test("renders fiscal year dropdown and search input", () => {
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByLabelText(/Search Employee/i)).toBeInTheDocument();
  });

  test("renders all employees by default", () => {
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  test("renders Manage buttons with correct hrefs", () => {
    const manageLinks = screen.getAllByRole("link", { name: /Manage/i });
    expect(manageLinks).toHaveLength(2);
    expect(manageLinks[0]).toHaveAttribute("href", "/employees/1");
    expect(manageLinks[1]).toHaveAttribute("href", "/employees/2");
  });
});
