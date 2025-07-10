/*
Author: Matthew Heering
Description:  Rect component form that is both an edit and new form to submit new employees to the database, or edit existing ones. 
Date: 6/18/25
*/
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function NewEmployeeForm({ employee = null, supervisors = [] }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    hire_date: "",
    termination_date: "",
    is_supervisor: false,
    is_administrator: false,
    supervisor_id: "",
  });

  const [errors, setErrors] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        password: "",
        password_confirmation: "",
      });
    }
  }, [employee]);

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute("content");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = employee ? `/employees/${employee.id}` : "/employees";
    const method = employee ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": getCSRFToken(),
      },
      body: JSON.stringify({ employee: formData }),
    });

    if (response.ok) {
      const data = await response.json();
      setToastOpen(true);
      setTimeout(() => {
        window.location.href = `/admin/dashboard`;
      }, 1500);
    } else {
      const errorData = await response.json();
      setErrors(
        Array.isArray(errorData) ? errorData : [JSON.stringify(errorData)]
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          {employee ? "Edit Employee Details" : "Create New Employee"}
        </Typography>

        {errors.length > 0 && (
          <Alert severity="error">
            {errors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </Alert>
        )}

        <Stack spacing={2} mt={2}>
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!employee}
          />
          <TextField
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required={!employee}
          />
          <TextField
            label="Hire Date"
            name="hire_date"
            type="date"
            value={formData.hire_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Termination Date"
            name="termination_date"
            type="date"
            value={formData.termination_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth>
            <InputLabel id="supervisor-select-label">Supervisor</InputLabel>
            <Select
              labelId="supervisor-select-label"
              name="supervisor_id"
              value={formData.supervisor_id || ""}
              label="Supervisor"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {supervisors.map((sup) => (
                <MenuItem key={sup.id} value={sup.id}>
                  {sup.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                name="is_supervisor"
                checked={formData.is_supervisor}
                onChange={handleChange}
              />
            }
            label="Is Supervisor?"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_administrator"
                checked={formData.is_administrator}
                onChange={handleChange}
              />
            }
            label="Is Administrator?"
          />
          <Button variant="contained" type="submit">
            {employee ? "Update Employee" : "Create Employee"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => (window.location.href = "/admin/dashboard")}
          >
            Cancel
          </Button>
        </Stack>
      </form>

      <Snackbar open={toastOpen} autoHideDuration={1500}>
        <Alert severity="success" sx={{ width: "100%" }}>
          {employee ? "Employee updated!" : "Employee created! Redirecting..."}
        </Alert>
      </Snackbar>
    </>
  );
}
