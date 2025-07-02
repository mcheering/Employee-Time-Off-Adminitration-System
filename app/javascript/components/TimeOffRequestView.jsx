import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";

const TimeOffRequestView = ({ request, employeeId }) => {
  if (!request) return <Typography>No request found.</Typography>;

  const reasonLabels = {
    0: "Vacation",
    1: "Sick",
    2: "Personal",
    3: "FMLA",
    4: "Other",
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleEdit = () => {
    window.location = `/employees/${employeeId}/time_off_requests/${request.id}/edit`;
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        View Time-Off Request
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>
            <strong>From:</strong> {request.from}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>To:</strong> {request.to}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <strong>Reason:</strong> {reasonLabels[request.reason]}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <strong>FMLA:</strong> {request.is_fmla ? "Yes" : "No"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <strong>Comment:</strong> {request.comment}
          </Typography>
        </Grid>
      </Grid>

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
