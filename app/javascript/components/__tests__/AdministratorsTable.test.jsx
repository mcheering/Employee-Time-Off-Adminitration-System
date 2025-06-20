/*
Author: Matthew Heering
Description: Component testing ot verify the admin table renders correctly. Reminder, the admin table just shows admisntrators.
Date: 6/18/25
*/
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdministratorsTable from "../AdministratorsTable";

describe("AdministratorsTable Component", () => {
  const mockAdministrators = [
    { id: 1, first_name: "Alice", last_name: "Smith" },
    { id: 2, first_name: "Bob", last_name: "Johnson" },
  ];

  test("renders table heading and rows", () => {
    render(<AdministratorsTable administrators={mockAdministrators} />);
    expect(screen.getByText(/administrators/i)).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("renders no rows if administrators list is empty", () => {
    render(<AdministratorsTable administrators={[]} />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(1);
  });
});
