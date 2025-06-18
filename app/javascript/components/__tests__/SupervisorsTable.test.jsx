import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SupervisorsTable from "../SupervisorsTable";

describe("SupervisorsTable Component", () => {
  const mockSupervisors = [
    {
      id: 1,
      first_name: "Alice",
      last_name: "Anderson",
      email: "alice@example.com",
      hire_date: "2021-06-01",
    },
    {
      id: 2,
      first_name: "Bob",
      last_name: "Brown",
      email: "bob@example.com",
      hire_date: "2020-05-15",
    },
  ];

  beforeEach(() => {
    global.window.location.href = "http://localhost";
  });

  test("renders table with supervisor data", () => {
    render(<SupervisorsTable supervisors={mockSupervisors} />);
    expect(screen.getByText("Alice Anderson")).toBeInTheDocument();
    expect(screen.getByText("Bob Brown")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("2020-05-15")).toBeInTheDocument();
  });

  test("displays fallback message when no data", () => {
    render(<SupervisorsTable supervisors={[]} />);
    expect(screen.getByText(/no supervisors to display/i)).toBeInTheDocument();
  });

  test("View button navigates to correct show page", () => {
    delete window.location;
    window.location = { href: "" };

    render(<SupervisorsTable supervisors={mockSupervisors} />);
    const viewButtons = screen.getAllByRole("button", { name: /View/i });

    fireEvent.click(viewButtons[0]);
    expect(window.location.href).toBe("/employees/1");
  });
});