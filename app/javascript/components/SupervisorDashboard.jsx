//Author: Matthew Heering
//Description: provides all data of employees undeer a supervisor and ability to manage their time-off requests
import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import TimeOffRequestsView from "./TimeOffRequestsView";
import CalendarView from "./CalendarView";
import EmployeeRecordsView from "./EmployeeRecordsView";

export default function SupervisorDashboard({
  supervisor,
  fiscalYears = [],
  selectedFy,
  statusOptions = [],
  selectedStatus = "",
  timeOffRequests = [],
  byDate = {},
  fyeRecords = [],
}) {
  const [activeTab, setActiveTab] = useState("requests");

  const handleFyChange = (event) => {
    const selectedId = event.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("fiscal_year_id", selectedId);
    window.location.search = searchParams.toString();
  };

  const renderTab = () => {
    switch (activeTab) {
      case "calendar":
        return <CalendarView byDate={byDate} />;
      case "records":
        return (
          <EmployeeRecordsView
            fyeRecords={fyeRecords}
            fiscalYears={fiscalYears}
            selectedFy={selectedFy}
          />
        );
      case "requests":
      default:
        return (
          <TimeOffRequestsView
            timeOffRequests={timeOffRequests}
            supervisor={supervisor}
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            fiscalYears={fiscalYears}
            selectedFy={selectedFy}
          />
        );
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="fy-select-label">Fiscal Year</InputLabel>
        <Select
          data-testid="fiscal-year-select"
          labelId="fy-select-label"
          value={selectedFy?.id || ""}
          label="Fiscal Year"
          onChange={handleFyChange}
        >
          {fiscalYears.map((fy) => (
            <MenuItem key={fy.id} value={fy.id}>
              {`${new Date(fy.start_date).getFullYear()}–${new Date(
                fy.end_date
              ).getFullYear()}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Button
          variant={activeTab === "requests" ? "contained" : "outlined"}
          onClick={() => setActiveTab("requests")}
        >
          Time-Off Requests
        </Button>
        <Button
          variant={activeTab === "calendar" ? "contained" : "outlined"}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar
        </Button>
        <Button
          variant={activeTab === "records" ? "contained" : "outlined"}
          onClick={() => setActiveTab("records")}
        >
          Employee Records
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ padding: 3 }}>
        {renderTab()}
      </Paper>
    </Box>
  );
}
