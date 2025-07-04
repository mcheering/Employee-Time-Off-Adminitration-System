//Author: Matthew Heering
//Description: Allows user to view a timeoff request they've made or an employee made.
//Date: 7/2/25
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
} from "@mui/material";

export default function TimeOffRequestsView({
  timeOffRequests,
  supervisor,
  fiscalYears,
  selectedFy,
  statusOptions,
  selectedStatus,
}) {
  const fullName = `${supervisor.first_name} ${supervisor.last_name}`;
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const paginatedRequests = timeOffRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {fullName}'s Supervisor Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        Time-Off Requests
      </Typography>

      {timeOffRequests.length === 0 ? (
        <Typography>No requests to display.</Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.employee_name}</TableCell>
                  <TableCell>{req.from}</TableCell>
                  <TableCell>{req.to}</TableCell>
                  <TableCell>{req.reason}</TableCell>
                  <TableCell>
                    <div>Approved: {req.decision_breakdown?.approved || 0}</div>
                    <div>Pending: {req.decision_breakdown?.pending || 0}</div>
                    <div>Denied: {req.decision_breakdown?.denied || 0}</div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        (window.location.href = `/supervisors/${supervisor.id}/time_off_requests/${req.id}/manage`)
                      }
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Stack mt={2} alignItems="center">
            <Pagination
              count={Math.ceil(timeOffRequests.length / rowsPerPage)}
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
