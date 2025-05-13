import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import KYCVerification from '../../build/contracts/KYCVerification.json';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {AppBar,Toolbar, Typography, Tabs, Tab, Box, Container, IconButton}

from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LightMode, DarkMode } from '@mui/icons-material';
import { Person as PersonIcon, HowToReg as HowToRegIcon, AdminPanelSettings as AdminPanelSettingsIcon } from '@mui/icons-material';

import ConnectTab from './components/ConnectTab.jsx';
import RequestVerificationTab from './components/RequestVerificationTab.jsx';
import AdminTab from './components/AdminTab.jsx';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { HelpOutline, CheckCircle, Error } from '@mui/icons-material';

const softLightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#1565C0',
    },
    secondary: {
      main: '#FF6F61',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
    divider: '#E0E0E0',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    primary: {
      main: '#90CAF9',
    },
    secondary: {
      main: '#F48FB1',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
    divider: '#424242',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [accountNo, setAccountNo] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleHelpOpen = () => setHelpOpen(true);
  const handleHelpClose = () => setHelpOpen(false);

  useEffect(() => {
    loadBlockchainData();
  }, [accountNo]);

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3('http://localhost:7545');
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      if (accounts.length > 0) {
        setAccount(accounts[accountNo]);
      }

      const networkId = await web3.eth.net.getId();
      const networkData = KYCVerification.networks[networkId];
      if (networkData) {
        const kycContract = new web3.eth.Contract(
          KYCVerification.abi,
          networkData.address
        );
        setContract(kycContract);
        loadPendingRequests(kycContract);
      } else {
        toast.error('Smart contract not deployed to the detected network.');
      }
    } catch (error) {
      toast.error('Error connecting to blockchain: ' + error.message);
    }
  };

  const loadPendingRequests = async (kycContract) => {
    const requests = await kycContract.getPastEvents('VerificationRequested', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    setPendingRequests(requests);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAccountChange = (event) => {
    setAccountNo(event.target.value);
  };

  const checkVerification = async () => {
    if (contract) {
      const verified = await contract.methods.isUserVerified(account).call();
      setIsVerified(verified);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : softLightTheme}>
      <CssBaseline />
      <AppBar position="static" elevation={1} sx={{ background: 'linear-gradient(30deg,rgb(225, 235, 250) 0%,rgb(164, 177, 197) 100%)', color: '#333', minHeight: 100, justifyContent: 'center'}}>
        <Toolbar sx={{ minHeight: 80, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🔐 KYC Verification System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Connected Account:
            </Typography>
            <Typography variant="body2" sx={{ backgroundColor: '#fff', px: 1.5, py: 0.5, borderRadius: 2, color: '#333', fontFamily: 'monospace' }}>
              {account ? account : 'Not connected'}
            </Typography>
            <IconButton onClick={handleHelpOpen} sx={{ color: '#333' }}>
              <HelpOutlineIcon />
            </IconButton>
            <IconButton onClick={toggleTheme} sx={{ color: '#333' }}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<PersonIcon />} label="Connect" />
          <Tab icon={<HowToRegIcon />} label="Request Verification" />
          <Tab icon={<AdminPanelSettingsIcon />} label="Admin" />
        </Tabs>
        <Box sx={{ mt: 3 }}>
          {currentTab === 0 && (
            <ConnectTab
              accounts={accounts}
              accountNo={accountNo}
              handleAccountChange={handleAccountChange}
            />
          )}
          {currentTab === 1 && (
            <RequestVerificationTab
              account={account}
              contract={contract}
              loadPendingRequests={() => loadPendingRequests(contract)}
              checkVerification={checkVerification}
              isVerified={isVerified}
            />
          )}
          {currentTab === 2 && (
            <AdminTab
              account={account}
              contract={contract}
              pendingRequests={pendingRequests}
              loadPendingRequests={() => loadPendingRequests(contract)}
            />
          )}
        </Box>
      </Container>

      <Dialog open={helpOpen} onClose={handleHelpClose}>
        <DialogTitle>How to Use the KYC Verification System</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <strong><PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Connect Tab:</strong> Choose and connect a test account from Ganache.
          </Typography>
          <Typography gutterBottom>
            <strong><HowToRegIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Request Verification:</strong> Submit your KYC verification request.
          </Typography>
          <Typography gutterBottom>
            <strong><AdminPanelSettingsIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Admin:</strong> Approve or reject pending KYC requests.
          </Typography>
          <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            {isDarkMode ? (
              <DarkMode sx={{ verticalAlign: 'middle', mr: 1 }} />
            ) : (
              <LightMode sx={{ verticalAlign: 'middle', mr: 1 }} />
            )}
            <strong> Theme:</strong> Switch between dark mode and light mode.
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelpClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="bottom-right" theme="light" />
    </ThemeProvider>
  );
}

export default App;
