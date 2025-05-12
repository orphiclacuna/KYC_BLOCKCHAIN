import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Chip,
} from '@mui/material';
import { toast } from 'react-toastify';

function RequestVerificationTab({ account, contract, loadPendingRequests, checkVerification, isVerified }) {
  const [aadharNumber, setAadharNumber] = useState('');
  const [name, setName] = useState('');
  const [statusChecked, setStatusChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await checkVerification();
      setStatusChecked(true);
    })();
  }, [account]);

  const handleSubmit = async () => {
    if (aadharNumber.length !== 16) {
      toast.error('Aadhar number must be 16 digits');
      return;
    }

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setLoading(true);
      await contract.methods
        .requestVerification(account, aadharNumber, name)
        .send({ from: account });

      toast.success('Verification request submitted');
      setAadharNumber('');
      setName('');
      loadPendingRequests();
    } catch (error) {
      console.error('Request error:', error);
      toast.error('Failed to submit request. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>
        Request Verification
      </Typography>

      {statusChecked && (
        <Alert severity={isVerified ? 'success' : 'info'} sx={{ mb: 2 }}>
          {isVerified
            ? '✅ Your account is already verified.'
            : '📝 You are not verified. Please submit your details.'}
        </Alert>
      )}

      <Box display="flex" gap={2} flexDirection="column" maxWidth={400}>
        <TextField
          label="Aadhar Number"
          variant="outlined"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
          inputProps={{ maxLength: 16 }}
        />

        <TextField
          label="Full Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || isVerified}
        >
          {loading ? 'Submitting...' : 'Submit Verification Request'}
        </Button>

        <Typography variant="body2" color="text.secondary">
          Note: You can only submit once per account.
        </Typography>
      </Box>
    </Paper>
  );
}

export default RequestVerificationTab;
