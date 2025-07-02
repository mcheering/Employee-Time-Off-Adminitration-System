//Author: Matthew Heering
//Description: SHows al employees under a supervisor
//Date: 7/2/25
import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function EmployeeRecordsView({ fyeRecords }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Employee Records
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Vacation Days</TableCell>
              <TableCell>PTO Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fyeRecords && fyeRecords.length > 0 ? (
              fyeRecords.map((rec, idx) => (
                <TableRow key={idx}>
                  <TableCell>{rec.employee_name || "Unknown"}</TableCell>
                  <TableCell>{rec.earned_vacation_days}</TableCell>
                  <TableCell>{rec.allotted_pto_days}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No records found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
