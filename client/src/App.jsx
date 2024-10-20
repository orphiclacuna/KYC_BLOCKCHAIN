import { useState, useEffect } from 'react';
import Web3 from 'web3';
import KYCVerification from './abis/KYCVerification.json';  // ABI of deployed contract

function App() {
    const [account, setAccount] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [contract, setContract] = useState(null);
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        loadBlockchainData();
    }, []);

    const loadBlockchainData = async () => {
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = KYCVerification.networks[networkId];
        if (networkData) {
            const kycContract = new web3.eth.Contract(KYCVerification.abi, networkData.address);
            setContract(kycContract);
        } else {
            alert('Smart contract not deployed to the detected network.');
        }
    };

    const requestVerification = async () => {
        await contract.methods.requestVerification(aadharNumber, name, dob).send({ from: account,gas:3000000 });
        alert('Verification request sent.');
    };

    const verifyUser = async (userAddress) => {
        await contract.methods.verifyUser(userAddress).send({ from: account });
        alert('User verified.');
    };

    const checkVerification = async () => {
        const verified = await contract.methods.isUserVerified(account).call();
        setIsVerified(verified);
    };

    return (
        <div>
            <h1>KYC Verification</h1>
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
            <input
                type="date"
                placeholder="Enter Date of Birth"
                value={dob}
                onChange={(e) => setDob(new Date(e.target.value).getTime() / 1000)} // Convert to timestamp
            />
            <button onClick={requestVerification}>Request Verification</button>

            <h2>Admin Verification</h2>
            <input
                type="text"
                placeholder="Enter User Address"
                onChange={(e) => setUserAddress(e.target.value)} // You can create a new state for userAddress
            />
            <button onClick={() => verifyUser(userAddress)}>Verify User</button>
            <button onClick={checkVerification}>Check My Verification</button>
            {isVerified && <p>User is Verified!</p>}
        </div>
    );
}

export default App;
