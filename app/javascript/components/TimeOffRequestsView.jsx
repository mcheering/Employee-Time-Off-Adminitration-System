import React from "react";
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeOffRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.employee_name}</TableCell>
                <TableCell>{req.from}</TableCell>
                <TableCell>{req.to}</TableCell>
                <TableCell>{req.reason}</TableCell>
                <TableCell>{req.status}</TableCell>
                <TableCell>{req.amount}</TableCell>
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
      )}
    </Box>
  );
}
