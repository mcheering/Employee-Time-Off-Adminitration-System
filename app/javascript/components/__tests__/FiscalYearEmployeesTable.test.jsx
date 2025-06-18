import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FiscalYearEmployeesTable from "../FiscalYearEmployeesTable";

describe("FiscalYearEmployeesTable", () => {
  const mockSetSelectedYear = jest.fn();
  const employees = [
    {
      id: 1,
      first_name: "Alice",
      last_name: "Johnson",
      available_vacation: 10,
      available_pto: 5,
    },
    {
      id: 2,
      first_name: "Bob",
      last_name: "Smith",
      available_vacation: 8,
      available_pto: 3,
    },
  ];
  const years = [
    { id: 1, start_date: "2024-01-01", end_date: "2024-12-31" },
    { id: 2, start_date: "2025-01-01", end_date: "2025-12-31" },
  ];

  it("renders fiscal year dropdown and employee data", () => {
    render(
      <FiscalYearEmployeesTable
        employees={employees}
        fiscalYears={years}
        selectedYear={1}
        setSelectedYear={mockSetSelectedYear}
      />
    );

    expect(screen.getByLabelText(/Select Fiscal Year/i)).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("changes selected year when a different option is chosen", () => {
    render(
      <FiscalYearEmployeesTable
        employees={employees}
        fiscalYears={years}
        selectedYear={1}
        setSelectedYear={mockSetSelectedYear}
      />
    );

    fireEvent.change(screen.getByLabelText(/Select Fiscal Year/i), {
      target: { value: "2" },
    });

    expect(mockSetSelectedYear).toHaveBeenCalledWith("2");
  });

  it("filters employee list by name", () => {
    render(
      <FiscalYearEmployeesTable
        employees={employees}
        fiscalYears={years}
        selectedYear={1}
        setSelectedYear={mockSetSelectedYear}
      />
    );

    fireEvent.change(screen.getByLabelText(/Search by name/i), {
      target: { value: "Alice" },
    });

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.queryByText("Bob Smith")).toBeNull();
  });

  it("shows no employees when filtered to none", () => {
    render(
      <FiscalYearEmployeesTable
        employees={employees}
        fiscalYears={years}
        selectedYear={1}
        setSelectedYear={mockSetSelectedYear}
      />
    );

    fireEvent.change(screen.getByLabelText(/Search by name/i), {
      target: { value: "Charlie" },
    });

    expect(screen.getByText("No employees to display.")).toBeInTheDocument();
  });
});