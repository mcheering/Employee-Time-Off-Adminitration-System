// Author: Matthew Heering
// Description: Manage time-off request with per-day (supervisor) and bulk (admin) decisions clearly separated, with validation.
// Date: 7/10/25 (Updated with validation)

import React, { useState } from "react";
import { Box, Typography, Paper, Button, Stack, Divider } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageTimeOffRequest({ request, redirectPath, role }) {
  const [dates, setDates] = useState(request.dates);
  const [finalDecision, setFinalDecision] = useState(request.final_decision);

  const getCSRFToken = () =>
    document.querySelector('meta[name="csrf-token"]')?.content || "";

  const baseUrl =
    role === "admin"
      ? `/administrators/time_off_requests/${request.id}`
      : `/supervisors/${request.supervisor_id}/time_off_requests/${request.id}`;

  const validateDatesExist = () => {
    if (!dates || dates.length === 0) {
      toast.error("No requested dates found for this request.");
      return false;
    }
    return true;
  };

  const handleStatusUpdate = async (dateId, decision) => {
    if (!validateDatesExist()) return;
    if (role === "admin") return;

    try {
      const endpoint = `${baseUrl}/update_date/${dateId}`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({ decision }),
      });

      if (!response.ok) throw new Error("Status update failed");

      setDates(dates.map((d) => (d.id === dateId ? { ...d, decision } : d)));

      toast.success(`Date updated to "${decision}"`, { autoClose: 1200 });
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    }
  };

  const handleBulkUpdate = async (decision) => {
    if (!validateDatesExist()) return;

    try {
      const endpoint =
        role === "admin"
          ? `${baseUrl}/update_final_all`
          : `${baseUrl}/update_all`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({ decision }),
      });

      if (!response.ok) throw new Error("Bulk update failed");

      if (role === "admin") {
        setFinalDecision(decision);
      } else {
        setDates(dates.map((d) => ({ ...d, decision })));
      }

      toast.success(`All updated to "${decision}"`, { autoClose: 1200 });
    } catch (err) {
      console.error(err);
      toast.error("Bulk update failed.");
    }
  };

  const handleBack = () => {
    window.location.href = redirectPath;
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
      <Typography>
        <strong>Request Status:</strong> {request.request_status}
      </Typography>
      <Typography>
        <strong>Final Decision:</strong> {finalDecision}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Requested Days:
      </Typography>

      {dates.map((date) => (
        <Paper key={date.id} sx={{ mb: 2, p: 2, backgroundColor: "#f9f9f9" }}>
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography>
              <strong>Date:</strong> {date.date} &nbsp;&nbsp;
              <strong>Amount:</strong> {date.amount === 1 ? "Full" : "Half"} Day
              &nbsp;&nbsp;
              <strong>Supervisor Decision:</strong> {date.decision}
            </Typography>
          </Box>

          {role === "supervisor" && (
            <Box sx={{ textAlign: "center" }}>
              <Stack direction="row" spacing={1} justifyContent="center">
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
                  color="primary"
                  onClick={() => handleStatusUpdate(date.id, "pending")}
                >
                  Request Info
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

      {role === "admin" && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Final Decision (Admin Only):
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => handleBulkUpdate("approved")}
            >
              Approve Request
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleBulkUpdate("denied")}
            >
              Deny Request
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleBulkUpdate("undecided")}
            >
              Mark Undecided
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBulkUpdate("waiting_information")}
            >
              Request Additional Info
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />
        </>
      )}

      <Box textAlign="center">
        <Button variant="outlined" onClick={handleBack}>
          Back to Dashboard
        </Button>
      </Box>
    </Paper>
  );
}
