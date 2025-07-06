//Author: Matthew Heering
//Description: View that allows user ot select which dashabord they want to see, which then renders the correct dashboard
//Date: 7/5/25
import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
  Typography,
} from "@mui/material";

export default function DashboardSelector() {
  const el = document.getElementById("dashboard-selector");
  const roles = JSON.parse(
    document.getElementById("dashboard-selector").dataset.roles
  );
  const navigateTo = (path) => {
    window.location.href = path;
  };

  const onlyEmployee = !roles.is_admin && !roles.is_supervisor;

  useEffect(() => {
    if (onlyEmployee) {
      navigateTo(`/employees/${roles.employee_id}`);
    }
  }, []);

  if (onlyEmployee) return null;

  return (
    <Dialog open>
      <DialogTitle>Select Dashboard</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>Welcome! Please select where to go:</Typography>
          <Button
            variant="contained"
            onClick={() => navigateTo(`/employees/${roles.employee_id}`)}
          >
            Employee Dashboard
          </Button>
          {roles.is_supervisor && (
            <Button
              variant="contained"
              onClick={() => navigateTo(`/supervisors/${roles.employee_id}`)}
            >
              Supervisor Dashboard
            </Button>
          )}
          {roles.is_admin && (
            <Button
              variant="contained"
              onClick={() => navigateTo(`/admin/dashboard`)}
            >
              Admin Dashboard
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
