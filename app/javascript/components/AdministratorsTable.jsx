/*
Author: Matthew Heering
Description: react component to neatly show the admisntrators of the company. 
Date: 6/14/25
*/
import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button
} from "@mui/material";

export default function AdministratorsTable({ administrators }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Administrators
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
          {administrators.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.id}</TableCell>
              <TableCell>{admin.first_name}</TableCell>
              <TableCell>{admin.last_name}</TableCell>
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