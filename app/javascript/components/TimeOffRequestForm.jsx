import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
} from "@mui/material";

const reasons = [
  { value: "pto", label: "PTO" },
  { value: "vacation", label: "Vacation" },
  { value: "jury_duty", label: "Jury Duty" },
  { value: "bereavement", label: "Bereavement" },
  { value: "unpaid", label: "Unpaid" },
  { value: "other", label: "Other" },
];

const TimeOffRequestForm = ({ request, fiscalYears, employeeId }) => {
  console.log("Rendering form:", { request, fiscalYears, employeeId });

  const isEdit = request && request.id;

  const today = new Date();
  const [selectedFiscalYearId, setSelectedFiscalYearId] = useState(() => {
    const currentFY = fiscalYears.find((fy) => {
      const start = new Date(fy.start_date);
      const end = new Date(fy.end_date);
      return today >= start && today <= end;
    });
    return currentFY?.id || fiscalYears?.[0]?.id || "";
  });

  const [formData, setFormData] = useState({
    request_date: request?.request_date?.slice(0, 10) || "",
    supervisor_decision_date:
      request?.supervisor_decision_date?.slice(0, 10) || "",
    reason: request?.reason || "",
    is_fmla: !!request?.is_fmla,
    comment: request?.comment || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = isEdit
      ? `/employees/${employeeId}/time_off_requests/${request.id}`
      : `/employees/${employeeId}/time_off_requests`;

    const method = isEdit ? "PATCH" : "POST";

    const tokenElement = document.querySelector("meta[name='csrf-token']");
    const csrfToken = tokenElement ? tokenElement.getAttribute("content") : "";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          time_off_request: formData,
          fiscal_year_id: selectedFiscalYearId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error("Failed to submit request");
      }

      window.location.href = `/employees/${employeeId}`;
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong while submitting the request.");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Edit Time-Off Request" : "New Time-Off Request"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          name="request_date"
          label="From Date"
          type="date"
          value={formData.request_date}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          name="supervisor_decision_date"
          label="To Date"
          type="date"
          value={formData.supervisor_decision_date}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          name="reason"
          label="Reason"
          value={formData.reason}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          {reasons.map((r) => (
            <MenuItem key={r.value} value={r.value}>
              {r.label}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.is_fmla}
              onChange={handleChange}
              name="is_fmla"
            />
          }
          label="FMLA"
        />

        <TextField
          fullWidth
          multiline
          name="comment"
          label="Comment"
          value={formData.comment}
          onChange={handleChange}
          rows={3}
          sx={{ mb: 2 }}
        />

        <Box display="flex" justifyContent="space-between">
          <Button type="button" variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? "Update Request" : "Submit Request"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TimeOffRequestForm;
