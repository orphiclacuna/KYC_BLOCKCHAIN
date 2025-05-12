import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Switch } from '@mui/material'
import { toast } from 'react-toastify'

function AdminTab({ account, contract, pendingRequests, loadPendingRequests }) {
  const [userAddress, setUserAddress] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [verifiedUsers, setVerifiedUsers] = useState({})
  const [showVerified, setShowVerified] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (contract && account) {
          const adminAddress = await contract.methods.admin().call()
          setIsAdmin(adminAddress.toLowerCase() === account.toLowerCase())
        }
      } catch (error) {
        console.error('Error checking admin:', error)
      }
    }

    const fetchVerificationStatus = async () => {
      const statuses = {}
      for (let req of pendingRequests) {
        const addr = req.returnValues.user
        try {
          const isVerified = await contract.methods.isUserVerified(addr).call()
          statuses[addr] = isVerified
        } catch (err) {
          statuses[addr] = false
        }
      }
      setVerifiedUsers(statuses)
    }

    checkAdmin()
    fetchVerificationStatus()
  }, [account, contract, pendingRequests])

  const verifyUser = async (address) => {
    try {
      await contract.methods.verifyUser(address).send({ from: account })
      toast.success('User verified.')
      loadPendingRequests()
    } catch (error) {
      console.error('Error verifying user:', error.message || error)
      toast.error('Failed to verify user.')
    }
  }

  const handleToggleVerified = () => {
    setShowVerified((prev) => !prev)
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Admin Panel</Typography>

      {!isAdmin && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must be the contract admin to verify users. Verification actions are disabled.
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <TextField
          label="User Address"
          variant="outlined"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          disabled={!isAdmin || verifiedUsers[userAddress]}
          onClick={() => verifyUser(userAddress)}
        >
          {verifiedUsers[userAddress] ? 'Verified' : 'Verify User'}
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Show Verified Only:</Typography>
        <Switch
          checked={showVerified}
          onChange={handleToggleVerified}
          color="primary"
        />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Address</TableCell>
              <TableCell>Aadhar Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRequests
              .filter((req) => (showVerified ? verifiedUsers[req.returnValues.user] : true))
              .map((req, idx) => {
                const user = req.returnValues.user
                const aadhar = req.returnValues.aadharNumber
                const isUserVerified = verifiedUsers[user]
                return (
                  <TableRow key={idx}>
                    <TableCell>{user}</TableCell>
                    <TableCell>{aadhar}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={isUserVerified ? 'success' : 'primary'}
                        disabled={!isAdmin || isUserVerified}
                        onClick={() => verifyUser(user)}
                      >
                        {isUserVerified ? 'Verified' : 'Verify'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default AdminTab
