//Author: Matthew Heering
//Description: views a single time-off request
//Date: 7/2/25
import React from "react";
import { Box, Typography, Paper, Grid, Button, Divider } from "@mui/material";

const TimeOffRequestView = ({ request, employeeId }) => {
  if (!request) return <Typography>No request found.</Typography>;

  const handleBack = () => {
    window.history.back();
  };

  const handleEdit = () => {
    window.location = `/employees/${employeeId}/time_off_requests/${request.id}/edit`;
  };

  const days = request.dates || [];

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        View Time-Off Request
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>
            <strong>Reason:</strong>{" "}
            {request.reason.charAt(0).toUpperCase() + request.reason.slice(1)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <strong>FMLA:</strong> {request.is_fmla ? "Yes" : "No"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <strong>Comment:</strong> {request.comment || "None"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Requested Days:
      </Typography>

      {days.length > 0 ? (
        days.map((day, idx) => (
          <Box
            key={idx}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              mb: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography>
              <strong>Date:</strong> {day.date}
            </Typography>
            <Typography>
              <strong>Amount:</strong>{" "}
              {parseFloat(day.amount) === 1 ? "Full Day" : "Half Day"}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No days requested.</Typography>
      )}

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          Edit
        </Button>
      </Box>
    </Paper>
  );
};

export default TimeOffRequestView;
