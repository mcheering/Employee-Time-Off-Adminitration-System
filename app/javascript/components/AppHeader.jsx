import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function AppHeader({ loggedIn, roles }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/employees/sign_out";

    const methodInput = document.createElement("input");
    methodInput.type = "hidden";
    methodInput.name = "_method";
    methodInput.value = "delete";
    form.appendChild(methodInput);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrf) {
      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "authenticity_token";
      csrfInput.value = csrf;
      form.appendChild(csrfInput);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Employee Time-Off Admin System
        </Typography>

        <Box>
          {loggedIn && roles ? (
            <>
              <IconButton onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => navigateTo(`/employees/${roles.employee_id}`)}
                >
                  Employee Dashboard
                </MenuItem>
                {roles.is_supervisor && (
                  <MenuItem
                    onClick={() =>
                      navigateTo(`/supervisors/${roles.employee_id}`)
                    }
                  >
                    Supervisor Dashboard
                  </MenuItem>
                )}
                {roles.is_admin && (
                  <MenuItem onClick={() => navigateTo("/admin/dashboard")}>
                    Admin Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" href="/employees/sign_in">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
