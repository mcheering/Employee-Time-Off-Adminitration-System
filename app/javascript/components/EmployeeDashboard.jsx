//Author: Matthew Heering
//Descirption: COntains an employees requested days off, ability to request more, and an ability edit prior requests.
//Date: 7/2/25
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  MenuItem,
  Select,
  Card,
  CardContent,
  Grid,
  InputLabel,
} from "@mui/material";

const EmployeeDashboard = ({
  requestsData,
  fiscalYearsData,
  summaryData,
  employeeId,
  employeeName,
}) => {
  const [selectedYear, setSelectedYear] = useState(
    fiscalYearsData[0]?.id || null
  );

  const attentionRequests = (() => {
    const el = document.getElementById("employee-attention-requests");
    if (!el) return [];
    try {
      return JSON.parse(el.textContent);
    } catch {
      return [];
    }
  })();

  useEffect(() => {
    if (!attentionRequests.length) return;

    attentionRequests.forEach((req) => {
      toast.info(
        <span>
          Request for dates starting on <strong>{req.from}</strong> requires
          your attention. <a href={req.edit_path}>Click here</a>
        </span>,
        { autoClose: false }
      );
    });
  }, []);
  const [requests, setRequests] = useState(requestsData);
  const [summary, setSummary] = useState(summaryData);
  const handleYearChange = (event) => {
    const yearId = event.target.value;
    setSelectedYear(yearId);

    fetch(`/employees/${employeeId}.json?fiscal_year_id=${yearId}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.time_off_payload);
        setSummary(data.summary);
      })
      .catch((err) => {
        console.error("Failed to fetch data for fiscal year:", err);
      });
  };

  const {
    earned_vacation_days,
    allotted_pto_days,
    used_vacation,
    used_pto,
    remaining_vacation,
    remaining_pto,
  } = summary || {};

  const handleView = (id) => {
    window.location.href = `/employees/${employeeId}/time_off_requests/${id}`;
  };

  const handleEdit = (id) => {
    window.location.href = `/employees/${employeeId}/time_off_requests/${id}/edit`;
  };

  const handleNewRequest = () => {
    window.location.href = `/employees/${employeeId}/time_off_requests/new?fiscal_year_id=${selectedYear}`;
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {employeeName}'s Time-Off Dashboard
      </Typography>
      <InputLabel>Fiscal Year</InputLabel>
      <Select
        value={selectedYear}
        onChange={handleYearChange}
        size="small"
        label="Fiscal Years"
      >
        {fiscalYearsData.map((fy) => (
          <MenuItem key={fy.id} value={fy.id}>
            {fy.caption}
          </MenuItem>
        ))}
      </Select>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Time-Off Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography>Earned Vacation: {earned_vacation_days}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Used Vacation: {used_vacation}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Remaining Vacation: {remaining_vacation}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Allotted PTO: {allotted_pto_days}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Used PTO: {used_pto}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Remaining PTO: {remaining_pto}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button variant="contained" color="primary" onClick={handleNewRequest}>
          Request Time Off
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Days (A/P/D)</TableCell>{" "}
              <TableCell>Request Status</TableCell>
              <TableCell>Final Decision</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.from}</TableCell>
                <TableCell>{req.to}</TableCell>
                <TableCell>{req.reason}</TableCell>
                <TableCell>
                  {`${req.decision_breakdown?.approved || 0}/${
                    req.decision_breakdown?.pending || 0
                  }/${req.decision_breakdown?.denied || 0}`}
                </TableCell>
                <TableCell>{req.request_status?.replace(/_/g, " ")}</TableCell>
                <TableCell>{req.final_decision}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => handleView(req.id)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEdit(req.id)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No requests for selected year.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeDashboard;
