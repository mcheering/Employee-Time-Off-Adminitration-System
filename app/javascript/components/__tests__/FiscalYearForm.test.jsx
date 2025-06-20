/*
Author: Matthew Heering
Description: Component testing to make sure the fiscal year form to add new fiscal year renders correctly. 
Date: 6/18/25
*/
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FiscalYearForm from "../FiscalYearForm";

describe("FiscalYearForm Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  it("renders empty form fields when no fiscalYear is passed", () => {
    render(<FiscalYearForm onClose={mockOnClose} onSave={mockOnSave} />);

    expect(screen.getByLabelText("Start Date")).toHaveValue("");
    expect(screen.getByLabelText("End Date")).toHaveValue("");
  });

  it("pre-fills form fields when fiscalYear prop is provided", () => {
    const fiscalYear = {
      id: 1,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
    };

    render(
      <FiscalYearForm
        fiscalYear={fiscalYear}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByLabelText("Start Date")).toHaveValue("2025-01-01");
    expect(screen.getByLabelText("End Date")).toHaveValue("2025-12-31");
  });

  it("calls onSave with correct data when Save is clicked", () => {
    render(<FiscalYearForm onClose={mockOnClose} onSave={mockOnSave} />);

    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2025-07-01" },
    });
    fireEvent.change(screen.getByLabelText("End Date"), {
      target: { value: "2026-06-30" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(mockOnSave).toHaveBeenCalledWith(
      {
        start_date: "2025-07-01",
        end_date: "2026-06-30",
      },
      undefined
    );
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<FiscalYearForm onClose={mockOnClose} onSave={mockOnSave} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
