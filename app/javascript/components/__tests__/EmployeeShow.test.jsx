/*
Author: Matthew Heering
Description: COmponent testing to verify the show page for each employee renders correctly. 
Date: 6/18/25
*/
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import EmployeeShow from "../EmployeeShow";

jest.mock("react-chartjs-2", () => ({
  Line: () => <div data-testid="mock-line-chart" />,
}));

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe("EmployeeShow Component", () => {
  const employee = {
    id: 1,
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice@example.com",
    hire_date: "2022-01-15",
    termination_date: null,
    is_supervisor: true,
    is_administrator: false,
    supervisor_id: 5,
  };

  test("renders employee details", () => {
    render(<EmployeeShow employee={employee} />);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/alice@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Yes/)).toBeInTheDocument();
    expect(screen.getByText(/No/)).toBeInTheDocument();
  });
});
