import React from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function ConnectTab({ accounts, accountNo, handleAccountChange }) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Connect Account
      </Typography>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="account-select-label">Account</InputLabel>
          <Select
            labelId="account-select-label"
            value={accountNo}
            label="Account"
            onChange={handleAccountChange}
          >
            {accounts.map((acc, index) => (
              <MenuItem key={index} value={index}>
                {`Account ${index + 1} (${acc})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}

export default ConnectTab;
