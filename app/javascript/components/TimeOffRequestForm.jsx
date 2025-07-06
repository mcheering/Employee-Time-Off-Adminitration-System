//Auhor: Matthew Heering
//Description: form for requesting time off or editing
//Date: 7/2/25
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
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

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
  fiscalYearEmployeeId,
  supervisorId,
}) => {
  const isEdit = request && request.id;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    reason: request?.reason || "",
    is_fmla: !!request?.is_fmla,
    comment: request?.comment || "",
  });

  const [days, setDays] = useState(request?.days || []);
  const [dayInput, setDayInput] = useState(() => {
    if (request?.days && request.days.length > 0) {
      return {
        date: request.days[0].date,
        amount: request.days[0].amount.toString(),
      };
    }

    return {
      date: new Date().toISOString().split("T")[0],
      amount: "1.0",
    };
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
    setDays((prev) => [...prev, { ...dayInput }]);
    setDayInput({ date: "", amount: "1.0" });
  };

  const removeDay = (index) => {
    setDays((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const method = isEdit ? "PATCH" : "POST";
      const url = isEdit
        ? `/employees/${employeeId}/time_off_requests/${request.id}`
        : `/employees/${employeeId}/time_off_requests`;

      const payload = {
        ...formData,
        days: days.map((d) => ({
          date: d.date,
          amount: parseFloat(d.amount),
        })),
        fiscal_year_employee_id: fiscalYearEmployeeId,
        supervisor_id: supervisorId,
        submitted_by_id: employeeId,
      };

      const csrfToken = document.querySelector(
        "meta[name='csrf-token']"
      )?.content;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ time_off_request: payload }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.join(", ") || "Request failed");
      }

      toast.success(
        isEdit
          ? "Request updated successfully!"
          : "Request submitted successfully!"
      );

      window.location.href = `/employees/${employeeId}`;
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      toast.error("Submission failed. Please check your input.");
    } finally {
      setSubmitting(false);
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
          <Button type="button" variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {isEdit ? "Update Request" : "Submit Request"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TimeOffRequestForm;
