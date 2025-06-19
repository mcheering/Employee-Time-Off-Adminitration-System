/*
Author: Matthew Heering
Description: view for the administrator dashboard to allow them to add and manage fiscal years
Date: 6/14/25 (Updated 6/15/25)
*/

import React, { useState } from "react";
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
} from "@mui/material";
import FiscalYearForm from "./FiscalYearForm";

function formatCaption(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start.getFullYear() === end.getFullYear()
    ? `${start.getFullYear()}`
    : `${start.getFullYear()}-${String(end.getFullYear()).slice(-2)}`;
}

export default function FiscalYearsTable({ fiscalYears: initialFiscalYears }) {
  const [fiscalYears, setFiscalYears] = useState(initialFiscalYears);
  const [openForm, setOpenForm] = useState(false);
  const [editingFiscalYear, setEditingFiscalYear] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const today = new Date();

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
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ fiscal_year: payload }),
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

  const isClosed = (endDate) => {
    return new Date(endDate) < today;
  };

  return (
    <>
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
          {fiscalYears.map((fy) => {
            const closed = isClosed(fy.end_date);
            return (
              <TableRow key={fy.id}>
                <TableCell>
                  {formatCaption(fy.start_date, fy.end_date)}
                </TableCell>
                <TableCell>{fy.start_date}</TableCell>
                <TableCell>{fy.end_date}</TableCell>
                <TableCell>{closed ? "Closed" : "Open"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleEdit(fy)}
                    disabled={closed}
                  >
                    Edit
                  </Button>
                  {closed && (
                    <Button
                      variant="outlined"
                      sx={{ ml: 1 }}
                      onClick={() => handleEdit(fy)}
                    >
                      Reopen
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
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
