/*
Author: Matthew Heering
Description: Summary table showing all employees, and allows admin to add employees, along with edit and delete by clicking view
Date: 6/14/25
*/
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";

export default function EmployeesTable({ employees, onManage }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("A-Z");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleSearchChange = (e) =>
    setSearchQuery(e.target.value.toLowerCase());
  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleFilter = (type) => setFilter(type);
  const handleChangePage = (_, newPage) => setPage(newPage);

  const filteredEmployees = employees
    .filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery) ||
        emp.email.toLowerCase().includes(searchQuery);
      const matchesFilter =
        filter === "all" ||
        (filter === "supervisors" && emp.is_supervisor) ||
        (filter === "administrators" && emp.is_administrator);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "A-Z":
          return a.name.localeCompare(b.name);
        case "Z-A":
          return b.name.localeCompare(a.name);
        case "Hire Date ↑":
          return new Date(a.hire_date) - new Date(b.hire_date);
        case "Hire Date ↓":
          return new Date(b.hire_date) - new Date(a.hire_date);
        default:
          return 0;
      }
    });

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!employees || employees.length === 0) {
    return <div>No employees to display.</div>;
  }

  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Manage Employees
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mb: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNavigation("/employees/new")}
          data-turbo="false"
        >
          ➕ Add New Employee
        </Button>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2 }}
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="A-Z">A–Z (Name)</MenuItem>
            <MenuItem value="Z-A">Z–A (Name)</MenuItem>
            <MenuItem value="Hire Date ↑">Hire Date ↑</MenuItem>
            <MenuItem value="Hire Date ↓">Hire Date ↓</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant={filter === "all" ? "contained" : "outlined"}
          onClick={() => handleFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "supervisors" ? "contained" : "outlined"}
          onClick={() => handleFilter("supervisors")}
        >
          Supervisors
        </Button>
        <Button
          variant={filter === "administrators" ? "contained" : "outlined"}
          onClick={() => handleFilter("administrators")}
        >
          Administrators
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hire Date</TableCell>
              <TableCell>Supervisor?</TableCell>
              <TableCell>Administrator?</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.hire_date}</TableCell>
                <TableCell>{emp.is_supervisor ? "Yes" : "No"}</TableCell>
                <TableCell>{emp.is_administrator ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onManage(emp)}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredEmployees.length > rowsPerPage && (
          <TablePagination
            component="div"
            count={filteredEmployees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        )}
      </TableContainer>
    </>
  );
}
