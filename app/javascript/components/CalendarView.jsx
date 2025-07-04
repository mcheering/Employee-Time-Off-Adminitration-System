//Author: Matthew Heering
//Description:  Calendar view of time-offs with status icons
//Date: 7/2/25
import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Pagination,
  Stack,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export default function CalendarView({ byDate }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const dates = Object.entries(byDate || {});
  const paginatedDates = dates.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const renderStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon sx={{ color: "green" }} />;
      case "pending":
        return <HourglassEmptyIcon sx={{ color: "goldenrod" }} />;
      case "denied":
        return <HighlightOffIcon sx={{ color: "red" }} />;
      default:
        return null;
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Calendar View
      </Typography>
      <List>
        {dates.length === 0 ? (
          <ListItem>
            <ListItemText primary="No time-off data found." />
          </ListItem>
        ) : (
          <>
            {paginatedDates.map(([date, entries]) => (
              <Box key={date} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{date}</Typography>
                {entries.map((entry, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      {renderStatusIcon(entry.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${entry.employee_name} — ${entry.reason} (${
                        entry.amount
                      } day${entry.amount > 1 ? "s" : ""})`}
                      secondary={`Status: ${entry.status}`}
                    />
                  </ListItem>
                ))}
                <Divider />
              </Box>
            ))}

            <Stack mt={2} alignItems="center">
              <Pagination
                count={Math.ceil(dates.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Stack>
          </>
        )}
      </List>
    </Box>
  );
}
