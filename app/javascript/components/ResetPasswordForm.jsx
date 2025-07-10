//Author: Matthew Heering
//Description: Reset password form
//Date: 7/9/25

import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";

const ResetPasswordForm = ({ resetUrl, csrfToken }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(resetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ employee: { email } }),
      });

      if (response.ok) {
        toast.success("Password reset instructions sent.");
      } else {
        toast.error("Failed to send reset instructions.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPasswordForm;
