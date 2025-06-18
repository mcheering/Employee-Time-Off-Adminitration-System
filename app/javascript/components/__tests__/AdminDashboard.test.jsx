import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminDashboard from "../AdminDashboard";

jest.mock("../EmployeesTable", () => () => <div>Employees Table</div>);
jest.mock("../FiscalYearsTable", () => () => <div>Fiscal Years Table</div>);
jest.mock("../FiscalYearEmployeesTable", () => () => <div>Fiscal Year Employees Table</div>);

const setupScriptTag = (id, data) => {
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/json";
  script.textContent = JSON.stringify(data);
  document.body.appendChild(script);
};

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    setupScriptTag("employees-data", [{ id: 1, name: "John Doe" }]);
    setupScriptTag("fiscal-years-data", [{ id: 1, year: 2025 }]);
    setupScriptTag("fiscal-year-employees-data", [{ id: 1, name: "John Doe", year: 2025 }]);
  });

  test("renders default Manage Employees view", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Employees Table")).toBeInTheDocument();
  });

  test("switches to Manage Fiscal Years view", () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole("button", { name: /manage fiscal years/i }));
    expect(screen.getByText("Fiscal Years Table")).toBeInTheDocument();
  });

  test("switches to Fiscal Year Employees view", () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole("button", { name: /fiscal year employees/i }));
    expect(screen.getByText("Fiscal Year Employees Table")).toBeInTheDocument();
  });

  test("handles empty data gracefully", () => {
    document.body.innerHTML = "";
    setupScriptTag("employees-data", []);
    setupScriptTag("fiscal-years-data", []);
    setupScriptTag("fiscal-year-employees-data", []);

    render(<AdminDashboard />);
    expect(screen.getByText("Employees Table")).toBeInTheDocument();
  });
});