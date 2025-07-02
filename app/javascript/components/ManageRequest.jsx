//Author: Matthew Heering
//Description: Form for adding or editing time-off requests
//Date: 7/2/25
import React, { useState } from "react";
import { Box, Typography, Paper, Button, Stack, Divider } from "@mui/material";

export default function ManageTimeOffRequest({ request }) {
  const [status, setStatus] = useState(request.status);

  const handleStatusUpdate = async (decision) => {
    try {
      const response = await fetch(
        `/supervisors/${request.supervisor_id}/time_off_requests/${request.id}/supervisor_decision`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decision }),
        }
      );

      if (!response.ok) throw new Error("Status update failed");

      const data = await response.json();
      alert("Status updated!");

      window.location.href = `/supervisors/${request.supervisor_id}`;
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6">Manage Time-Off Request</Typography>
      <Typography>
        <strong>Employee:</strong> {request.employee_name}
      </Typography>
      <Typography>
        <strong>Reason:</strong> {request.reason}
      </Typography>
      <Typography>
        <strong>Current Status:</strong> {request.status}
      </Typography>
      <Typography>
        <strong>Comment:</strong> {request.comment}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleStatusUpdate("approve")}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleStatusUpdate("deny")}
        >
          Deny
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleStatusUpdate("more_info")}
        >
          Request Info
        </Button>
      </Stack>
    </Paper>
  );
}
