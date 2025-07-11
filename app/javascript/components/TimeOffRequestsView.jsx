// Author: Matthew Heering
// Description: Allows admin/supervisor to view and manage time-off requests with search, sorting, status & supervisor filters.
// Date: 7/5/25 (updated to hide supervisor filter for supervisors)

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Pagination,
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  TableSortLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function TimeOffRequestsView({
  timeOffRequests,
  supervisor,
  supervisorsList = [],
  role = "supervisor",
}) {
  const fullName =
    role === "supervisor" && supervisor?.name
      ? `${supervisor.name}'s Employees Time-Off Requests`
      : "All Time-Off Requests";

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilters, setStatusFilters] = useState({
    approved: true,
    pending: true,
    denied: true,
  });
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  const rowsPerPage = 10;

  const handleChangePage = (_, value) => setPage(value);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const filteredRequests = timeOffRequests
    .filter((req) => {
      const matchesSearch =
        req.employee_name?.toLowerCase().includes(searchQuery) ||
        req.reason?.toLowerCase().includes(searchQuery);
      const matchesStatus =
        Object.entries(req.decision_breakdown || {}).every(
          ([status, count]) => {
            if (count > 0 && !statusFilters[status]) return false;
            return true;
          }
        ) &&
        Object.entries(statusFilters).some(
          ([status, enabled]) => enabled && req.decision_breakdown?.[status] > 0
        );
      const matchesSupervisor =
        !selectedSupervisor || req.supervisor_id === selectedSupervisor;
      return matchesSearch && matchesStatus && matchesSupervisor;
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const aVal = a[sortColumn] || "";
      const bVal = b[sortColumn] || "";
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const summary = filteredRequests.reduce(
    (acc, req) => {
      acc.requests += 1;
      acc.days +=
        req.decision_breakdown.approved +
        req.decision_breakdown.pending +
        req.decision_breakdown.denied;
      acc.approved += req.decision_breakdown.approved;
      acc.pending += req.decision_breakdown.pending;
      acc.denied += req.decision_breakdown.denied;
      return acc;
    },
    { requests: 0, days: 0, approved: 0, pending: 0, denied: 0 }
  );

  const paginatedRequests = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getManageUrl = (req) => {
    return role === "admin"
      ? `/administrators/time_off_requests/${req.id}/manage`
      : `/supervisors/${req.supervisor_id}/time_off_requests/${req.id}/manage`;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {fullName}
      </Typography>

      <Typography variant="subtitle1">Summary:</Typography>
      <Typography variant="body2" paragraph>
        Requests: <strong>{summary.requests}</strong> | Total Days:{" "}
        <strong>{summary.days}</strong> | Approved:{" "}
        <strong>{summary.approved}</strong> | Pending:{" "}
        <strong>{summary.pending}</strong> | Denied:{" "}
        <strong>{summary.denied}</strong>
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          sx={{ minWidth: 200 }}
        />

        {["approved", "pending", "denied"].map((status) => (
          <FormControlLabel
            key={status}
            control={
              <Checkbox
                checked={statusFilters[status]}
                onChange={() => handleStatusChange(status)}
              />
            }
            label={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        ))}

        {role === "admin" && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Supervisor</InputLabel>
            <Select
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              label="Supervisor"
            >
              <MenuItem value="">
                <em>All Supervisors</em>
              </MenuItem>
              {supervisorsList.map((sup) => (
                <MenuItem key={sup.id} value={sup.id}>
                  {sup.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>

      {timeOffRequests.length === 0 ? (
        <Typography>No requests to display.</Typography>
      ) : (
        <>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    { label: "Employee", key: "employee_name" },
                    { label: "From", key: "from" },
                    { label: "To", key: "to" },
                    { label: "Reason", key: "reason" },
                  ].map((col) => (
                    <TableCell
                      key={col.key}
                      sortDirection={
                        sortColumn === col.key ? sortDirection : false
                      }
                    >
                      <TableSortLabel
                        active={sortColumn === col.key}
                        direction={
                          sortColumn === col.key ? sortDirection : "asc"
                        }
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell>Request Status</TableCell>
                  <TableCell>Final Decision</TableCell>
                  <TableCell>Days (A/P/D)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRequests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell>{req.employee_name}</TableCell>
                    <TableCell>{req.from}</TableCell>
                    <TableCell>{req.to}</TableCell>
                    <TableCell>{req.reason}</TableCell>

                    <TableCell>
                      {req.request_status === "waiting_information"
                        ? "Waiting for Info"
                        : req.request_status}
                    </TableCell>

                    <TableCell>{req.final_decision}</TableCell>

                    <TableCell>
                      {req.decision_breakdown?.approved || 0}/
                      {req.decision_breakdown?.pending || 0}/
                      {req.decision_breakdown?.denied || 0}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          (window.location.href = getManageUrl(req))
                        }
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Stack mt={2} alignItems="center">
            <Pagination
              count={Math.ceil(filteredRequests.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Box>
  );
}
