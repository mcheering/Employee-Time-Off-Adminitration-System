/*
Author: Matthew Heering
Description: Component testing to make sure the supervisors table properly renders as expected.
Date: 6/18/25
*/
import React from "react";
import { render, screen } from "@testing-library/react";
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

  test("renders ID, first and last names", () => {
    render(<SupervisorsTable supervisors={mockSupervisors} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Anderson")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Brown")).toBeInTheDocument();
  });

  test("renders empty tbody when no supervisors", () => {
    render(<SupervisorsTable supervisors={[]} />);

    const rows = screen.queryAllByRole("row");
    expect(rows).toHaveLength(1);
  });
});
