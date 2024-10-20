import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { toast } from 'react-toastify';

function AdminTab({ account, contract, pendingRequests, loadPendingRequests }) {
  const [userAddress, setUserAddress] = useState('');

  const verifyUser = async (address) => {
    try {
      await contract.methods.verifyUser(address).send({ from: account });
      toast.success("User verified.");
      loadPendingRequests();
    } catch (error) {
      console.error("Error verifying user:", error.message || error);
      toast.error("Failed to verify user. Please check the console for details.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="User Address"
          variant="outlined"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Button variant="contained" onClick={() => verifyUser(userAddress)}>
          Verify User
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Address</TableCell>
              <TableCell>Aadhar Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRequests.map((request, index) => (
              <TableRow key={index}>
                <TableCell>{request.returnValues.user}</TableCell>
                <TableCell>{request.returnValues.aadharNumber}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => verifyUser(request.returnValues.user)}>
                    Verify
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default AdminTab;
