// SupervisorDashboard.jsx
import React, { useState } from "react";
import { Box, Button, Stack, Paper } from "@mui/material";
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
  console.log("component rendered supervisor", supervisor);
  console.log("component rendered fiscalyears", fiscalYears);
  console.log("component rendered selectedfy", selectedFy);
  console.log("component rendered status options", statusOptions);
  console.log("component rendered selected status", selectedStatus);
  console.log("component rendered timeOffRequests", timeOffRequests);
  console.log("component rendered byDate", byDate);
  console.log("component rendered fyeRecords", fyeRecords);

  const [activeTab, setActiveTab] = useState("requests");

  console.log("SupervisorDashboard props", {
    supervisor,
    fiscalYears,
    selectedFy,
    statusOptions,
    selectedStatus,
    timeOffRequests,
    byDate,
    fyeRecords,
  });

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
