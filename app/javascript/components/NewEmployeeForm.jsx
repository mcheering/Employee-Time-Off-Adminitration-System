/* Author: Matthew Heering
 * Description: React component for creating or editing an employee.
 * If editing, pre-fills fields and submits an update. Otherwise, creates a new employee.
 * Date: 6/14/25
 */

import React, { useState, useEffect } from "react";
import {
  TextField, Button, Stack, Checkbox, FormControlLabel,
  Typography, Snackbar, Alert
} from "@mui/material";

export default function NewEmployeeForm({ employee = null }) {
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

  const [errors, setErrors] = useState({});
  const [toastOpen, setToastOpen] = useState(false);

  // If editing, populate form with existing employee data
  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        password: "",
        password_confirmation: "",
      });
    }
  }, [employee]);

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
      },
      body: JSON.stringify({ employee: formData }),
    });

    if (response.ok) {
      const data = await response.json();
      setToastOpen(true);

      setTimeout(() => {
        window.location.href = `/employees/${data.id}`;
      }, 1500);
    } else {
      const errorData = await response.json();
      setErrors(errorData);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          {employee ? "Edit Employee Details" : "Create New Employee"}
        </Typography>
        <Stack spacing={2}>
          <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
          <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
          <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required={!employee} />
          <TextField label="Confirm Password" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} required={!employee} />
          <TextField label="Hire Date" name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="Termination Date" name="termination_date" type="date" value={formData.termination_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="Supervisor ID" name="supervisor_id" value={formData.supervisor_id} onChange={handleChange} />
          <FormControlLabel control={<Checkbox name="is_supervisor" checked={formData.is_supervisor} onChange={handleChange} />} label="Is Supervisor?" />
          <FormControlLabel control={<Checkbox name="is_administrator" checked={formData.is_administrator} onChange={handleChange} />} label="Is Administrator?" />
          <Button variant="contained" type="submit">
            {employee ? "Update Employee" : "Create Employee"}
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