import React, { useState } from "react";
import {
  TextField, Button, Stack, Checkbox, FormControlLabel, Typography
} from "@mui/material";

export default function NewEmployeeForm() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ employee: formData }),
    });

    if (response.ok) {
      const data = await response.json();
      window.location.href = `/employees/${data.id}`;
    } else {
      const errorData = await response.json();
      setErrors(errorData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>Create New Employee</Typography>
      <Stack spacing={2}>
        <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
        <TextField label="Confirm Password" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} required />
        <TextField label="Hire Date" name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField label="Termination Date" name="termination_date" type="date" value={formData.termination_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField label="Supervisor ID" name="supervisor_id" value={formData.supervisor_id} onChange={handleChange} />
        <FormControlLabel control={<Checkbox name="is_supervisor" checked={formData.is_supervisor} onChange={handleChange} />} label="Is Supervisor?" />
        <FormControlLabel control={<Checkbox name="is_administrator" checked={formData.is_administrator} onChange={handleChange} />} label="Is Administrator?" />
        <Button variant="contained" type="submit">Create Employee</Button>
      </Stack>
    </form>
  );
}