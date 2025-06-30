// app/javascript/components/TimeOffRequestsView.jsx
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
  Button,
  Paper,
} from "@mui/material";

export default function TimeOffRequestsView({
  supervisor,
  fiscalYears,
  selectedFy,
  statusOptions,
  selectedStatus,
  timeOffRequests,
}) {
  console.log("SupervisorDashboard propsfor TimeOffRequestView", {
    supervisor,
    timeOffRequests,
    statusOptions,
    selectedStatus,
    fiscalYears,
    selectedFy,
  });
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Time-Off Requests
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeOffRequests && timeOffRequests.length > 0 ? (
              timeOffRequests.map((req, idx) => (
                <TableRow key={idx}>
                  <TableCell>{req.employee_name || "Unknown"}</TableCell>
                  <TableCell>{req.from}</TableCell>
                  <TableCell>{req.to}</TableCell>
                  <TableCell>{req.reason}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" disabled>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No time-off requests found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
