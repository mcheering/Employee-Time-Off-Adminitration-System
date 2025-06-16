/*
Author: Matthew Heering
Description: Allows admin to view employees by fiscal year and search, showing dynamic vacation calculations.
Date: Updated 6/15/25
*/

import React, { useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Select, MenuItem, InputLabel, FormControl, TextField, Button, Stack
} from "@mui/material";

function formatCaption(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start.getFullYear() === end.getFullYear()
    ? `${start.getFullYear()}`
    : `${start.getFullYear()}-${String(end.getFullYear()).slice(-2)}`;
}

export default function FiscalYearEmployeesTable({ fiscalYearEmployees, fiscalYears }) {
  const [fiscalYearId, setFiscalYearId] = useState("");
  const [search, setSearch] = useState("");

  const filtered = fiscalYearEmployees.filter(fye => {
    const matchesYear = fiscalYearId ? fye.fiscal_year_id === Number(fiscalYearId) : true;
    const matchesSearch = fye.employee_name?.toLowerCase().includes(search.toLowerCase());
    return matchesYear && matchesSearch;
  });

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Fiscal Year</InputLabel>
          <Select value={fiscalYearId} onChange={(e) => setFiscalYearId(e.target.value)} label="Fiscal Year">
            <MenuItem value="">All</MenuItem>
            {fiscalYears.map((fy) => (
              <MenuItem key={fy.id} value={fy.id}>
                {formatCaption(fy.start_date, fy.end_date)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Available Vacation</TableCell>
            <TableCell>Available PTO</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((fye) => (
            <TableRow key={fye.id}>
              <TableCell>{fye.employee_name}</TableCell>
              <TableCell>{fye.earned_vacation_days}</TableCell>
              <TableCell>{fye.allotted_pto_days}</TableCell>
              <TableCell>
                <Button variant="contained" href={`/employees/${fye.employee_id}`}>Manage</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}