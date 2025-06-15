/*
Author: Matthew Heering
Description: view for the administrator dashboard to allow them to add and manage fiscal years
Date: 6/14/25
*/
import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

export default function FiscalYearsTable({ fiscalYears }) {
  return (
    <>
      <Button variant="outlined" sx={{ mb: 2 }}>Add Fiscal Year</Button>
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
              <TableCell>{fy.caption}</TableCell>
              <TableCell>{fy.start_date}</TableCell>
              <TableCell>{fy.end_date}</TableCell>
              <TableCell>{fy.status}</TableCell>
              <TableCell>
                <Button variant="contained" disabled={fy.status === "closed"}>Edit</Button>
                <Button variant="outlined" sx={{ ml: 1 }}>
                  {fy.status === "closed" ? "Open" : "Close"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}