/*
Author: Matthew Heering
Description: Just a simple header with the name of the application, and login and logout buttons
Date: 6/15/2025
*/
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function AppHeader({ loggedIn }) {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Employee Time-Off Admin System
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