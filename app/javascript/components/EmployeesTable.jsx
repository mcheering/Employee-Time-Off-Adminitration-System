import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button, Stack
} from "@mui/material";

export default function EmployeesTable({ employees }) {
  console.log("Employees received:", employees);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  if (!employees || employees.length === 0) {
    return <div>No employees to display.</div>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Employees
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hire Date</TableCell>
              <TableCell>Supervisor?</TableCell>
              <TableCell>Administrator?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.hire_date}</TableCell>
                <TableCell>{emp.is_supervisor ? "Yes" : "No"}</TableCell>
                <TableCell>{emp.is_administrator ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Buttons Section */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => handleNavigation("/employees/new")} data-turbo="false">
          ➕ Add New Employee
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => handleNavigation("/supervisors")}>
          👥 View Supervisors
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => handleNavigation("/administrators")}>
          🛠️ View Administrators
        </Button>
      </Stack>
    </>
  );
}