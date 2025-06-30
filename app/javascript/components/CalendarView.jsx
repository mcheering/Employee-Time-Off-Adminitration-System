// app/javascript/components/CalendarView.jsx
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

export default function CalendarView({ byDate }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Calendar View
      </Typography>
      <List>
        {Object.keys(byDate || {}).length === 0 ? (
          <ListItem>
            <ListItemText primary="No time-off data found." />
          </ListItem>
        ) : (
          Object.entries(byDate).map(([date, entries]) => (
            <Box key={date}>
              <Typography variant="subtitle1">{date}</Typography>
              {entries.map((entry, idx) => (
                <ListItem key={idx}>
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
          ))
        )}
      </List>
    </Box>
  );
}
