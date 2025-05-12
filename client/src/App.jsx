import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import KYCVerification from "../../build/contracts/KYCVerification.json";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
  IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LightMode, DarkMode } from '@mui/icons-material';

import ConnectTab from './components/ConnectTab.jsx';
import RequestVerificationTab from './components/RequestVerificationTab.jsx';
import AdminTab from './components/AdminTab.jsx';

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

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [accountNo, setAccountNo] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadBlockchainData();
  }, [accountNo]);

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
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
      toast.error("Smart contract not deployed to the detected network.");
    }
  };

  const loadPendingRequests = async (kycContract) => {
    const requests = await kycContract.getPastEvents("VerificationRequested", {
      fromBlock: 0,
      toBlock: "latest",
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
    <ThemeProvider theme={softLightTheme}>
      <CssBaseline />
      <AppBar position="static" elevation={1} sx={{ background: 'linear-gradient(30deg,rgb(225, 235, 250) 0%,rgb(164, 177, 197) 100%)', color: '#333' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            🔐 KYC Verification System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Connected:
            </Typography>
            <Typography variant="body2" sx={{ backgroundColor: '#fff', px: 1.5, py: 0.5, borderRadius: 2, color: '#333', fontFamily: 'monospace' }}>
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
            </Typography>
            <IconButton onClick={toggleTheme} sx={{ color: '#333' }}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="body1" gutterBottom>
          Connected Account: {account}
        </Typography>
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
      <ToastContainer position="bottom-right" theme="light" />
    </ThemeProvider>
  );
}

export default App;
