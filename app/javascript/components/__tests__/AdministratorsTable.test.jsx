import React from "react";
import { render, screen } from "@testing-library/react";
import AdministratorsTable from "../AdministratorsTable";

const mockAdmins = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice@example.com",
    hire_date: "2021-01-10",
    is_supervisor: false,
    is_administrator: true
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Lee",
    email: "bob@example.com",
    hire_date: "2022-02-15",
    is_supervisor: true,
    is_administrator: true
  }
];

describe("AdministratorsTable Component", () => {
  test("renders administrator table with data", () => {
    render(<AdministratorsTable administrators={mockAdmins} />);

    expect(screen.getByText(/administrators/i)).toBeInTheDocument();
    expect(screen.getByText(/alice johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/bob lee/i)).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3); // 1 header + 2 rows
  });

  test("handles empty admin list gracefully", () => {
    render(<AdministratorsTable administrators={[]} />);
    expect(screen.getByText(/no administrators to display/i)).toBeInTheDocument();
  });

  test("displays Yes/No for supervisor/admin fields", () => {
    render(<AdministratorsTable administrators={mockAdmins} />);

    expect(screen.getAllByText("Yes").length).toBeGreaterThan(0);
    expect(screen.getAllByText("No").length).toBeGreaterThanOrEqual(0);
  });
});