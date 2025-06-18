/*
Author: Matthew Heering
Description: Header with app name on the left, company name in the center, and login/logout on the right.
Date: Updated 6/14/2025
*/

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function AppHeader({ loggedIn }) {
  const headerEl = document.getElementById("react-layout-header");
  const companyName = headerEl?.dataset?.companyName || "Your Company";

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" sx={{ flex: 1 }}>
          Employee Time-Off Admin System
        </Typography>

        <Typography
          variant="h6"
          component="div"
          sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
        >
          {companyName}
        </Typography>

        <Box>
          {loggedIn ? (
            <Button color="inherit" href="/logout">
              Logout
            </Button>
          ) : (
            <Button color="inherit" disabled sx={{ opacity: 0.6 }}>
              Login (Not Working)
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}