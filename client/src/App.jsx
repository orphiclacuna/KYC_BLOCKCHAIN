import { useState, useEffect } from "react";
import Web3 from "web3";
import KYCVerification from "./abis/KYCVerification.json"; // ABI of deployed contract

function App() {
  const [account, setAccount] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [name, setName] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [denialReason, setDenialReason] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [accountNo, setAccountNo] = useState(0); // Default account is the first one
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    loadBlockchainData();
  }, [accountNo]); // Reload blockchain data when accountNo changes

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    setAccounts(accounts); // Store all accounts in state
    if (accounts.length > 0) {
      setAccount(accounts[accountNo]); // Set the selected account
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
      alert("Smart contract not deployed to the detected network.");
    }
  };

  const loadPendingRequests = async (kycContract) => {
    const requests = await kycContract.getPastEvents("VerificationRequested", {
      fromBlock: 0,
      toBlock: "latest",
    });
    setPendingRequests(requests);
  };

  const requestVerification = async () => {
    if (aadharNumber.length !== 16) {
      alert("Aadhar number must be 16 digits.");
      return;
    }
    if (!name) {
      alert("Name is required.");
      return;
    }

    try {
      console.log(account, aadharNumber, name);
      await contract.methods
        .requestVerification(account, aadharNumber, name)
        .send({ from: account, gas: 3000000 });
      alert("Verification request sent.");
      loadPendingRequests(contract); // Refresh pending requests after requesting
    } catch (error) {
      console.error("Error requesting verification:", error.message || error);
      alert("Failed to send verification request. Please check the console for details.");
    }
  };

  const verifyUser = async (userAddress) => {
    try {
      await contract.methods.verifyUser(userAddress).send({ from: account });
      alert("User verified.");
      loadPendingRequests(contract);
    } catch (error) {
      console.error("Error verifying user:", error.message || error);
      alert("Failed to verify user. Please check the console for details.");
    }
  };

  const denyVerification = async () => {
    try {
      await contract.methods
        .denyVerification(userAddress, denialReason)
        .send({ from: account });
      alert("Verification denied.");
      loadPendingRequests(contract);
    } catch (error) {
      console.error("Error denying verification:", error.message || error);
      alert("Failed to deny verification. Please check the console for details.");
    }
  };

  const checkVerification = async () => {
    const verified = await contract.methods.isUserVerified(account).call();
    setIsVerified(verified);
  };

  const getUserDetails = async () => {
    try {
      const details = await contract.methods.getUserDetails(userAddress).call();
      setUserDetails({
        aadharNumber: details[0],
        name: details[1],
        isVerified: details[2],
      });
    } catch (error) {
      console.error("Error fetching user details:", error.message || error);
      alert("Failed to fetch user details. Please check the console for details.");
    }
  };

  return (
    <div>
      <h1>KYC Verification</h1>

      {/* Account Selection Dropdown */}
      <label>Select Account Number: </label>
      <select
        value={accountNo}
        onChange={(e) => setAccountNo(e.target.value)}
      >
        {accounts.map((acc, index) => (
          <option key={index} value={index}>
            {`Account ${index + 1} (${acc})`}
          </option>
        ))}
      </select>

      <p>Connected Account: {account}</p>

      <h2>User Verification</h2>
      <input
        type="text"
        placeholder="Enter Aadhar Number"
        value={aadharNumber}
        onChange={(e) => setAadharNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={requestVerification}>Request Verification</button>

      <h2>Admin Verification</h2>
      <input
        type="text"
        placeholder="Enter User Address"
        onChange={(e) => setUserAddress(e.target.value)}
      />
      <button onClick={() => verifyUser(userAddress)}>Verify User</button>
      <button onClick={checkVerification}>Check My Verification</button>
      {/* <button onClick={denyVerification}>Deny Verification</button> */}
      {/* <input
        type="text"
        placeholder="Reason for Denial"
        value={denialReason}
        onChange={(e) => setDenialReason(e.target.value)}
      /> */}
      {isVerified && <p>User is Verified!</p>}

      <h3>Pending Verification Requests</h3>
      <ul>
        {pendingRequests.map((request, index) => (
          <li key={index}>
            Aadhar: {request.returnValues.aadharNumber} requested by{" "}
            {request.returnValues.user}
          </li>
        ))}
      </ul>

      {userDetails && (
        <div>
          <h4>User Details</h4>
          <p>Aadhar Number: {userDetails.aadharNumber}</p>
          <p>Name: {userDetails.name}</p>
          <p>Verified: {userDetails.isVerified ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}

export default App;
