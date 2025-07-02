//Author: Matthew Heering
//Descirption: COntains an employees requested days off, ability to request more, and an ability edit prior requests.
//Date: 7/2/25
import React, { useState } from "react";
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
  const [requests, setRequests] = useState(requestsData);

  const handleYearChange = (event) => {
    const yearId = event.target.value;
    setSelectedYear(yearId);
    const filtered = requestsData.filter(
      (req) => req.fiscal_year_id === yearId
    );
    setRequests(filtered);
  };

  const { earned_vacation_days, allotted_pto_days, used_vacation, used_pto } =
    summaryData;

  const remainingVacation = earned_vacation_days - used_vacation;
  const remainingPTO = allotted_pto_days - used_pto;

  const handleView = (id) => {
    window.location.href = `/employees/${employeeId}/time_off_requests/${id}`;
  };

  const handleEdit = (id) => {
    window.location.href = `/employees/${employeeId}/time_off_requests/${id}/edit`;
  };

  const handleNewRequest = () => {
    window.location.href = `/employees/${employeeId}/time_off_requests/new`;
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {employeeName}'s Time-Off Dashboard
      </Typography>

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
              <Typography>Remaining Vacation: {remainingVacation}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Allotted PTO: {allotted_pto_days}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Used PTO: {used_pto}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Remaining PTO: {remainingPTO}</Typography>
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
        <Select value={selectedYear} onChange={handleYearChange} size="small">
          {fiscalYearsData.map((fy) => (
            <MenuItem key={fy.id} value={fy.id}>
              {fy.caption}
            </MenuItem>
          ))}
        </Select>

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
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
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
                  {typeof req.amount === "number"
                    ? req.amount.toFixed(1)
                    : "N/A"}
                </TableCell>
                <TableCell>{req.status}</TableCell>
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
                <TableCell colSpan={6} align="center">
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
