// Author: Matthew Heering
// Description: Form for requesting or editing time-off with validation.
// Date: 7/11/25 (updated to filter closed fiscal years)

import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const reasons = [
  { value: "pto", label: "PTO" },
  { value: "vacation", label: "Vacation" },
  { value: "jury_duty", label: "Jury Duty" },
  { value: "bereavement", label: "Bereavement" },
  { value: "unpaid", label: "Unpaid" },
  { value: "other", label: "Other" },
];

const TimeOffRequestForm = ({
  request,
  fiscalYears,
  employeeId,
  supervisorId,
  initialFiscalYearId,
  initialFiscalYearEmployeeId,
  fiscalYearClosed,
}) => {
  const isEdit = !!request?.id;

  const visibleYears = isEdit
    ? fiscalYears
    : fiscalYears.filter((fy) => fy.is_open);

  const defaultFY = isEdit
    ? initialFiscalYearId
    : visibleYears[0]?.id || initialFiscalYearId;

  const [selectedFiscalYearId, setSelectedFiscalYearId] = useState(defaultFY);
  const [fiscalYearEmployeeId, setFiscalYearEmployeeId] = useState(
    initialFiscalYearEmployeeId
  );

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reason: request?.reason || "",
    is_fmla: !!request?.is_fmla,
    comment: request?.comment || "",
  });

  const [days, setDays] = useState(request?.days || []);
  const [dayInput, setDayInput] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "1.0",
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayChange = (e) => {
    const { name, value } = e.target;
    setDayInput((prev) => ({ ...prev, [name]: value }));
  };

  const addDay = () => {
    if (!dayInput.date || !dayInput.amount) return;

    const fy = fiscalYears.find((fy) => fy.id === selectedFiscalYearId);
    if (!fy) {
      toast.error("Fiscal year not selected.");
      return;
    }

    const date = new Date(dayInput.date);
    const start = new Date(fy.start_date);
    const end = new Date(fy.end_date);

    if (date < start || date > end) {
      toast.error(
        `Date ${dayInput.date} is outside fiscal year (${fy.start_date} - ${fy.end_date}).`
      );
      return;
    }

    setDays((prev) => [...prev, { ...dayInput }]);
    setDayInput({ date: "", amount: "1.0" });
  };

  const removeDay = (index) => {
    setDays((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fy = fiscalYears.find((fy) => fy.id === selectedFiscalYearId);
    if (!fy) {
      toast.error("Fiscal year data missing.");
      setSubmitting(false);
      return;
    }

    const invalidDates = days.filter((d) => {
      const date = new Date(d.date);
      return date < new Date(fy.start_date) || date > new Date(fy.end_date);
    });

    if (invalidDates.length > 0) {
      toast.error(
        `Some dates (${invalidDates
          .map((d) => d.date)
          .join(", ")}) are outside fiscal year (${fy.start_date} - ${
          fy.end_date
        }).`
      );
      setSubmitting(false);
      return;
    }

    try {
      const method = isEdit ? "PATCH" : "POST";
      const url = isEdit
        ? `/employees/${employeeId}/time_off_requests/${request.id}.json`
        : `/employees/${employeeId}/time_off_requests.json`;

      const payload = {
        ...formData,
        days: days.map((d) => ({ date: d.date, amount: parseFloat(d.amount) })),
        fiscal_year_employee_id: fiscalYearEmployeeId,
        supervisor_id: supervisorId,
        submitted_by_id: employeeId,
      };

      console.log("payload", payload);

      const csrfToken =
        document.querySelector("meta[name='csrf-token']")?.content || "";

      const response = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ time_off_request: payload }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.errors?.join(", ") || "Request failed");

      toast.success(
        isEdit
          ? "Request updated successfully!"
          : "Request submitted successfully!"
      );
      window.location.href = `/employees/${employeeId}`;
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please check your input.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Edit Time-Off Request" : "New Time-Off Request"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Fiscal Year</InputLabel>
          <Select
            value={selectedFiscalYearId}
            onChange={(e) =>
              setSelectedFiscalYearId(parseInt(e.target.value, 10))
            }
          >
            {visibleYears.map((fy) => (
              <MenuItem key={fy.id} value={fy.id}>
                {fy.caption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          select
          fullWidth
          name="reason"
          label="Reason"
          value={formData.reason}
          onChange={handleFormChange}
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
              onChange={handleFormChange}
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
          onChange={handleFormChange}
          rows={3}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" sx={{ mt: 3 }}>
          Add Requested Days
        </Typography>

        <Box display="flex" gap={2} sx={{ mb: 2 }}>
          <TextField
            name="date"
            label="Date"
            type="date"
            value={dayInput.date}
            onChange={handleDayChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            name="amount"
            label="Amount"
            select
            value={dayInput.amount}
            onChange={handleDayChange}
            fullWidth
          >
            <MenuItem value="1.0">Full Day</MenuItem>
            <MenuItem value="0.5">Half Day</MenuItem>
          </TextField>
          <Button variant="outlined" onClick={addDay}>
            Add
          </Button>
        </Box>

        {days.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Requested Days:</Typography>
            <List dense>
              {days.map((d, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeDay(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${d.date} - ${
                      parseFloat(d.amount) === 1 ? "Full Day" : "Half Day"
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between">
          <Button
            type="button"
            variant="outlined"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          {fiscalYearClosed && (
            <Typography color="error">
              This fiscal year is closed. You cannot submit new requests.
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting || fiscalYearClosed}
          >
            {isEdit ? "Update Request" : "Submit Request"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TimeOffRequestForm;
