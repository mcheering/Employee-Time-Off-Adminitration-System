/*
Author: Matthew Heering
Description: component that renders a table of the employee just created with the NewEmployeeForm component. 
Date: 6/14/25
*/
import React from "react";
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableRow, Paper, Stack, Button
} from "@mui/material";

export default function EmployeeShow({ employee }) {
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleBack = () => {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("return_to");

    if (returnTo === "admin_dashboard_fiscal_year_employees") {
      window.location.href = "/admin/dashboard";
    } else {
      window.history.back();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    const response = await fetch(`/employees/${employee.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      handleNavigation("/employees");
    } else {
      alert("Failed to delete employee.");
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>Employee Details</Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: 600 }}>
        <Table>
          <TableBody>
            <TableRow><TableCell>First Name</TableCell><TableCell>{employee.first_name}</TableCell></TableRow>
            <TableRow><TableCell>Last Name</TableCell><TableCell>{employee.last_name}</TableCell></TableRow>
            <TableRow><TableCell>Email</TableCell><TableCell>{employee.email}</TableCell></TableRow>
            <TableRow><TableCell>Hire Date</TableCell><TableCell>{employee.hire_date}</TableCell></TableRow>
            <TableRow><TableCell>Termination Date</TableCell><TableCell>{employee.termination_date || "N/A"}</TableCell></TableRow>
            <TableRow><TableCell>Is Supervisor</TableCell><TableCell>{employee.is_supervisor ? "Yes" : "No"}</TableCell></TableRow>
            <TableRow><TableCell>Is Administrator</TableCell><TableCell>{employee.is_administrator ? "Yes" : "No"}</TableCell></TableRow>
            <TableRow><TableCell>Supervisor ID</TableCell><TableCell>{employee.supervisor_id || "None"}</TableCell></TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
        <Button variant="outlined" onClick={() => handleNavigation(`/employees/${employee.id}/edit`)}>Edit</Button>
        <Button variant="outlined" onClick={handleBack}>Back</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
      </Stack>
    </>
  );
}