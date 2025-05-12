import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';

function ConnectTab({ accounts, accountNo, handleAccountChange }) {
  const [loading, setLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      setAccountStatus(`Connected to: ${accounts[accountNo]}`);
    }
  }, [accounts, accountNo]);

  const handleConnect = async () => {
    if (accounts.length === 0) {
      toast.error('No accounts available to connect');
      return;
    }
    setLoading(true);
    try {
      // Simulate connection or any other operation
      setTimeout(() => {
        toast.success('Account connected successfully!');
        setAccountStatus(`Connected to: ${accounts[accountNo]}`);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to connect to account');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>
        Connect Your Wallet
      </Typography>

      {!accountStatus && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please select an account to connect.
        </Alert>
      )}

      {accountStatus && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {accountStatus}
        </Alert>
      )}

      <Box display="flex" gap={2} flexDirection="column" maxWidth={400}>
        <FormControl fullWidth>
          <InputLabel>Choose Account</InputLabel>
          <Select
            value={accountNo}
            onChange={handleAccountChange}
            disabled={loading || accounts.length === 0}
          >
            {accounts.map((acc, index) => (
              <MenuItem key={index} value={index}>
                {acc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleConnect}
          disabled={loading || accounts.length === 0}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Connect Account'}
        </Button>

        {accounts.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No accounts found. Make sure your wallet is connected.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default ConnectTab;
