import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmployeesTable from "../EmployeesTable";
import "@testing-library/jest-dom";

const mockEmployees = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Smith",
    email: "alice@example.com",
    hire_date: "2023-01-01",
    is_supervisor: true,
    is_administrator: false,
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob@example.com",
    hire_date: "2022-05-15",
    is_supervisor: false,
    is_administrator: true,
  },
];

describe("EmployeesTable Component", () => {
  test("renders table headers and all employee rows", () => {
    render(<EmployeesTable employees={mockEmployees} />);

    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Hire Date")).toBeInTheDocument();
    expect(screen.getByText("Supervisor?")).toBeInTheDocument();
    expect(screen.getByText("Administrator?")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  test("renders Add New Employee button", () => {
    render(<EmployeesTable employees={mockEmployees} />);
    expect(screen.getByRole("button", { name: /add new employee/i })).toBeInTheDocument();
  });

  test("filters results based on search query", () => {
    render(<EmployeesTable employees={mockEmployees} />);
    const searchInput = screen.getByLabelText("Search");
    
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
  });

  test("shows message when no employees provided", () => {
    render(<EmployeesTable employees={[]} />);
    expect(screen.getByText("No employees to display.")).toBeInTheDocument();
  });
});