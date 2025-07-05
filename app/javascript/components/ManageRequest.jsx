// Author: Matthew Heering
// Description: Manage time-off request with per-day and bulk approval/denial, with toast + redirect
// Date: 7/3/25

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageTimeOffRequest({ request }) {
  const [dates, setDates] = useState(request.dates);

  const redirectToDashboard = () => {
    setTimeout(() => {
      window.location.href = `/supervisors/${request.supervisor_id}`;
    }, 1500); // give user time to see the toast
  };

  const handleStatusUpdate = async (dateId, decision) => {
    try {
      const response = await fetch(
        `/supervisors/${request.supervisor_id}/time_off_requests/${request.id}/update_date/${dateId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decision }),
        }
      );

      if (!response.ok) throw new Error("Status update failed");

      setDates(dates.map((d) => (d.id === dateId ? { ...d, decision } : d)));

      toast.success(`Date updated to "${decision}"`, { autoClose: 1200 });
      redirectToDashboard();
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    }
  };

  const handleBulkUpdate = async (decision) => {
    try {
      const response = await fetch(
        `/supervisors/${request.supervisor_id}/time_off_requests/${request.id}/update_all`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decision }),
        }
      );

      if (!response.ok) throw new Error("Bulk update failed");

      setDates(dates.map((d) => ({ ...d, decision })));

      toast.success(`All dates updated to "${decision}"`, { autoClose: 1200 });
      redirectToDashboard();
    } catch (err) {
      console.error(err);
      toast.error("Bulk update failed.");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Manage Time-Off Request
      </Typography>

      <Typography>
        <strong>Employee:</strong> {request.employee_name}
      </Typography>
      <Typography>
        <strong>Reason:</strong> {request.reason}
      </Typography>
      <Typography>
        <strong>Comment:</strong> {request.comment || "None"}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Requested Days:
      </Typography>

      {dates.map((date) => (
        <Paper key={date.id} sx={{ mb: 2, p: 2, backgroundColor: "#f9f9f9" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography>
                <strong>Date:</strong> {date.date}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>
                <strong>Amount:</strong> {date.amount === 1 ? "Full" : "Half"}{" "}
                Day
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>
                <strong>Status:</strong> {date.decision}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusUpdate(date.id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleStatusUpdate(date.id, "denied")}
                >
                  Deny
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  onClick={() => handleStatusUpdate(date.id, "pending")}
                >
                  Request Info
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Bulk Actions:
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleBulkUpdate("approved")}
        >
          Approve All
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleBulkUpdate("denied")}
        >
          Deny All
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleBulkUpdate("pending")}
        >
          Request Info For All
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Box textAlign="center">
        <Button variant="outlined" onClick={handleBack}>
          Back to Dashboard
        </Button>
      </Box>
    </Paper>
  );
}
