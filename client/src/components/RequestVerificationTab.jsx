import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';

function RequestVerificationTab({ account, contract, loadPendingRequests, checkVerification, isVerified }) {
  const [formData, setFormData] = useState({
    aadharNumber: '',
    name: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.aadharNumber.length !== 16) {
      toast.error("Aadhar number must be 16 digits.");
      return;
    }
    if (!formData.name) {
      toast.error("Name is required.");
      return;
    }

    try {
      await contract.methods
        .requestVerification(account, formData.aadharNumber, formData.name)
        .send({ from: account, gas: 3000000 });
      toast.success("Verification request sent.");
      loadPendingRequests();
    } catch (error) {
      console.error("Error requesting verification:", error.message || error);
      toast.error("Failed to send verification request. Please check the console for details.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Request KYC Verification
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Aadhar Number"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" sx={{ mt: 3, mr: 2 }}>
          Submit Verification Request
        </Button>
        <Button variant="contained" onClick={checkVerification} sx={{ mt: 3 }}>
          Check My Verification
        </Button>
      </Box>
      {isVerified && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          <Typography>User is Verified!</Typography>
        </Box>
      )}
    </Paper>
  );
}

export default RequestVerificationTab;
