import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button
} from "@mui/material";

export default function SupervisorsTable({ supervisors }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Supervisors
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {supervisors.map((sup) => (
            <TableRow key={sup.id}>
              <TableCell>{sup.id}</TableCell>
              <TableCell>{sup.first_name}</TableCell>
              <TableCell>{sup.last_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={() => window.location.href = "/employees"}>
        Back to Employees
      </Button>
    </TableContainer>
  );
}