/*
Author: Matthew Heering
Description: React component that renders fiscal year employee data into a paginated table, and allows filtering of data and searchablility. 
Date: 6/18/25
*/
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Stack,
  TablePagination,
} from "@mui/material";

function formatCaption(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start.getFullYear() === end.getFullYear()
    ? `${start.getFullYear()}`
    : `${start.getFullYear()}-${String(end.getFullYear()).slice(-2)}`;
}

export default function FiscalYearEmployeesTable({
  fiscalYearEmployees,
  fiscalYears,
}) {
  const [fiscalYearId, setFiscalYearId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const filtered = fiscalYearEmployees.filter((fye) => {
    const matchesYear = fiscalYearId
      ? fye.fiscal_year_id === Number(fiscalYearId)
      : true;
    const matchesSearch = fye.employee_name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="fiscal-year-label">Fiscal Year</InputLabel>
          <Select
            labelId="fiscal-year-label"
            value={fiscalYearId}
            onChange={(e) => {
              setFiscalYearId(e.target.value);
              setPage(0);
            }}
            label="Fiscal Year"
          >
            {fiscalYears.map((fy) => (
              <MenuItem key={fy.id} value={fy.id}>
                {formatCaption(fy.start_date, fy.end_date)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Search Employee"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Hire Date</TableCell>
            <TableCell>Fiscal Year</TableCell>
            <TableCell>Available Vacation</TableCell>
            <TableCell>Available PTO</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((fye) => (
            <TableRow key={fye.id}>
              <TableCell>{fye.employee_name}</TableCell>
              <TableCell>{fye.hire_date}</TableCell>
              <TableCell>{fye.fiscal_year_caption}</TableCell>
              <TableCell>{fye.earned_vacation_days}</TableCell>
              <TableCell>{fye.allotted_pto_days}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  href={`/employees/${fye.employee_id}`}
                >
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </>
  );
}
