/*
Author: Matthew Heering
Description: Form component for adding and editing fiscal years
Date: 6/15/25
*/

import React, { useState, useEffect } from "react";
import { TextField, Button, Stack } from "@mui/material";

export default function FiscalYearForm({ onClose, onSave, fiscalYear }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (fiscalYear) {
      setStartDate(fiscalYear.start_date);
      setEndDate(fiscalYear.end_date);
    } else {
      setStartDate("");
      setEndDate("");
    }
  }, [fiscalYear]);

  const handleSubmit = () => {
    const payload = {
      start_date: startDate,
      end_date: endDate,
    };
    onSave(payload, fiscalYear?.id);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Stack spacing={2}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
