// Author: Matthew Heering
// Description: view for the administrator dashboard to allow them to add and manage fiscal years
// Date: 6/14/25 (Updated: with Close button)

import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import FiscalYearForm from "./FiscalYearForm";

function formatCaption(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start.getFullYear() === end.getFullYear()
    ? `${start.getFullYear()}`
    : `${start.getFullYear()}-${String(end.getFullYear()).slice(-2)}`;
}

export default function FiscalYearsTable({ fiscalYears, setFiscalYears }) {
  const [openForm, setOpenForm] = React.useState(false);
  const [editingFiscalYear, setEditingFiscalYear] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleAdd = () => {
    setEditingFiscalYear(null);
    setOpenForm(true);
  };

  const handleEdit = (fy) => {
    setEditingFiscalYear(fy);
    setOpenForm(true);
  };

  const handleSave = async (payload, id) => {
    try {
      const method = id ? "PATCH" : "POST";
      const url = id ? `/fiscal_years/${id}` : "/fiscal_years";

      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      )?.content;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      const updatedList = id
        ? fiscalYears.map((fy) => (fy.id === data.id ? data : fy))
        : [...fiscalYears, data];

      setFiscalYears(updatedList);
      setOpenForm(false);
      setSnackbar({
        open: true,
        message: "Fiscal year saved successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error saving fiscal year.",
        severity: "error",
      });
    }
  };

  const handleReopen = async (fy) => {
    try {
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      )?.content;

      const payload = {
        fiscal_year: {
          start_date: fy.start_date,
          end_date: fy.end_date,
          is_open: true,
        },
      };

      const response = await fetch(`/fiscal_years/${fy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Server returned errors:", errData);
        throw new Error("Failed to reopen");
      }

      const updated = await response.json();
      setFiscalYears(
        fiscalYears.map((f) => (f.id === updated.id ? updated : f))
      );
      setSnackbar({
        open: true,
        message: "Fiscal year reopened!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error reopening fiscal year.",
        severity: "error",
      });
    }
  };

  const handleClose = async (fy) => {
    try {
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      )?.content;

      const payload = {
        fiscal_year: {
          start_date: fy.start_date,
          end_date: fy.end_date,
          is_open: false,
        },
      };

      const response = await fetch(`/fiscal_years/${fy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Server returned errors:", errData);
        throw new Error("Failed to close");
      }

      const updated = await response.json();
      setFiscalYears(
        fiscalYears.map((f) => (f.id === updated.id ? updated : f))
      );
      setSnackbar({
        open: true,
        message: "Fiscal year closed!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error closing fiscal year.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Manage Fiscal Years
      </Typography>

      <Button variant="outlined" sx={{ mb: 2 }} onClick={handleAdd}>
        Add Fiscal Year
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Caption</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fiscalYears.map((fy) => (
            <TableRow key={fy.id}>
              <TableCell>
                {formatCaption(fy.start_date, fy.end_date)}
                {!fy.is_open && (
                  <Typography variant="caption" color="error" display="block">
                    Fiscal Year is Closed
                  </Typography>
                )}
              </TableCell>
              <TableCell>{fy.start_date}</TableCell>
              <TableCell>{fy.end_date}</TableCell>
              <TableCell>{fy.is_open ? "Open" : "Closed"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleEdit(fy)}
                  disabled={!fy.is_open}
                >
                  Edit
                </Button>

                {fy.is_open && (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleClose(fy)}
                  >
                    Close
                  </Button>
                )}

                {!fy.is_open && (
                  <Button
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => handleReopen(fy)}
                  >
                    Reopen
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingFiscalYear ? "Edit Fiscal Year" : "Add Fiscal Year"}
        </DialogTitle>
        <DialogContent>
          <FiscalYearForm
            fiscalYear={editingFiscalYear}
            onClose={() => setOpenForm(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
