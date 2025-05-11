import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import KYCVerification from "../../build/contracts/KYCVerification.json"; // ABI of deployed contract
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import ConnectTab from './components/ConnectTab.jsx';
import RequestVerificationTab from './components/RequestVerificationTab.jsx';
import AdminTab from './components/AdminTab.jsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            KYC Verification System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="body1" gutterBottom>
          Connected Account: {account}
        </Typography>
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label="Connect" />
          <Tab label="Request Verification" />
          <Tab label="Admin" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
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
      <ToastContainer position="bottom-right" theme="dark" />
    </ThemeProvider>
  );
}

export default App;
