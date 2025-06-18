import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from "../AdminDashboard";

const mockEmployees = [
  { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", hire_date: "2020-01-01", is_supervisor: false, is_administrator: true },
  { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com", hire_date: "2019-05-01", is_supervisor: true, is_administrator: false }
];

const mockFiscalYears = [
  { id: 1, start_date: "2023-01-01", end_date: "2023-12-31", status: "open" },
  { id: 2, start_date: "2022-01-01", end_date: "2022-12-31", status: "closed" }
];

const mockFiscalYearEmployees = [
  { id: 1, employee_id: 1, fiscal_year_id: 1, available_vacation: 10, available_pto: 5 }
];

describe("AdminDashboard Component", () => {
  test("renders default Manage Employees view", () => {
    render(
      <AdminDashboard
        employees={mockEmployees}
        fiscalYears={mockFiscalYears}
        fiscalYearEmployees={mockFiscalYearEmployees}
      />
    );

    expect(screen.getByText(/employees/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  test("switches to Manage Fiscal Years view", () => {
    render(
      <AdminDashboard
        employees={mockEmployees}
        fiscalYears={mockFiscalYears}
        fiscalYearEmployees={mockFiscalYearEmployees}
      />
    );

    fireEvent.click(screen.getByText(/manage fiscal years/i));
    expect(screen.getByText(/start date/i)).toBeInTheDocument();
  });

  test("switches to Fiscal Year Employees view", () => {
    render(
      <AdminDashboard
        employees={mockEmployees}
        fiscalYears={mockFiscalYears}
        fiscalYearEmployees={mockFiscalYearEmployees}
      />
    );

    fireEvent.click(screen.getByText(/fiscal year employees/i));
    expect(screen.getByText(/available vacation/i)).toBeInTheDocument();
  });

  test("handles empty props without crashing", () => {
    render(<AdminDashboard employees={[]} fiscalYears={[]} fiscalYearEmployees={[]} />);
    expect(screen.getByText(/employees/i)).toBeInTheDocument();
  });
});