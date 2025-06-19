/*
Author: Matthew Heering
Description: Component testing to verify the New/Edit form for employees renders correctly. 
Date: 6/18/25
*/
import React from "react";
import { render, screen } from "@testing-library/react";
import NewEmployeeForm from "../NewEmployeeForm";

describe("NewEmployeeForm Component", () => {
  test("renders all expected input fields and buttons", () => {
    render(<NewEmployeeForm />);

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();

    const passwordFields = screen.getAllByLabelText(/Password/i);
    expect(passwordFields).toHaveLength(2);

    expect(screen.getByLabelText(/Hire Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Termination Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Supervisor")).toBeInTheDocument();
    expect(screen.getByLabelText(/Is Supervisor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Is Administrator/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Create Employee/i })
    ).toBeInTheDocument();
  });
});
