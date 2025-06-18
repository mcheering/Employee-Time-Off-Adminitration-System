import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewEmployeeForm from "../NewEmployeeForm";

describe("NewEmployeeForm Component", () => {
  const sampleEmployee = {
    id: 1,
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    hire_date: "2022-01-01",
    termination_date: "",
    is_supervisor: false,
    is_administrator: true,
    supervisor_id: 5,
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders form fields", () => {
    render(<NewEmployeeForm employeeData={sampleEmployee} mode="edit" />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hire Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Termination Date/i)).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty required fields", async () => {
    render(<NewEmployeeForm employeeData={{}} mode="new" />);
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/hire date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test("submits form successfully in edit mode", async () => {
    render(<NewEmployeeForm employeeData={sampleEmployee} mode="edit" />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Updated" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/employees/1", expect.objectContaining({
        method: "PATCH",
      }));
    });
  });

  test("submits form successfully in new mode", async () => {
    render(<NewEmployeeForm employeeData={{}} mode="new" />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "jane.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Hire Date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/employees", expect.objectContaining({
        method: "POST",
      }));
    });
  });

  test("shows error message when password and confirmation don't match", async () => {
    render(<NewEmployeeForm employeeData={{}} mode="new" />);

    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "DifferentPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});