/*
Author: Matthew Heering
Description: allows admin to view employees by fiscal yeara dn search 
Date: 6/14/25
*/
import React, { useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Select, MenuItem, InputLabel, FormControl, TextField, Button, Stack
} from "@mui/material";

export default function FiscalYearEmployeesTable({ fiscalYearEmployees }) {
  const [fiscalYearId, setFiscalYearId] = useState("");
  const [search, setSearch] = useState("");

  const filtered = fiscalYearEmployees.filter(fye => {
    const matchesYear = fiscalYearId ? fye.fiscal_year_id === Number(fiscalYearId) : true;
    const matchesSearch = fye.employee_name.toLowerCase().includes(search.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const uniqueFiscalYears = [...new Set(fiscalYearEmployees.map(fye => fye.fiscal_year_id))];

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Fiscal Year</InputLabel>
          <Select value={fiscalYearId} onChange={(e) => setFiscalYearId(e.target.value)} label="Fiscal Year">
            <MenuItem value="">All</MenuItem>
            {uniqueFiscalYears.map((id) => (
              <MenuItem key={id} value={id}>FY {id}</MenuItem>
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
                <Button variant="contained" href={`/employees/${fye.employee_id}`}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}