# KYC System on Blockchain

## Overview

This project is a decentralized **Know Your Customer (KYC) system** built on the Ethereum blockchain using **Truffle** and **EVM (Ethereum Virtual Machine)**. The system ensures secure storage and access to KYC documents using a **decentralized storage system**, allowing users to undergo KYC verification only once, with data shared securely across platforms. This approach eliminates redundancy, enhances security, and provides better privacy for users.

## Features

- **Decentralized KYC Verification**: Once a user's documents are verified, they do not need to repeat the KYC process with other organizations.
- **Blockchain-Based Security**: Uses Ethereum blockchain for immutability and security.
- **Decentralized Storage**: Stores KYC documents using decentralized storage for secure and permanent data handling.
- **Smart Contracts**: Automates the verification process using Ethereum smart contracts.
- **Reduced Redundancy**: Eliminates the need for multiple verifications by different organizations.
- **Improved Privacy**: Users have control over who accesses their data.

## Technologies Used

- **Truffle**: Development framework for Ethereum smart contracts.
- **Ethereum Virtual Machine (EVM)**: For executing smart contracts.
- **Solidity**: Smart contract language used to write the KYC system.
- **Decentralized Storage**: For storing user documents (can be IPFS, Filecoin, or any other decentralized storage system).
- **Web3.js**: JavaScript library to interact with the Ethereum blockchain.
- **Metamask**: For blockchain wallet integration.
- **Node.js**: Backend runtime environment.
- **React.js**: Frontend framework for the user interface.

## Project Structure

```
kyc-blockchain-system/
├── contracts/
│   ├── KYCContract.sol        # Smart contract for managing KYC data
│   └── Migrations.sol         # Manages migrations of smart contracts
├── migrations/
│   └── 1_initial_migration.js # Deploy contracts to the blockchain
├── src/
│   ├── components/
│   └── App.js                 # React application frontend
├── test/
│   └── KYCContract.test.js    # Smart contract test cases
├── package.json               # Project dependencies and scripts
├── truffle-config.js          # Truffle configuration file
└── README.md                  # This README file
```

## Setup

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v14+)
- **Truffle** (v5+): `npm install -g truffle`
- **Ganache**: For local blockchain development.
- **MetaMask**: Browser extension for interacting with Ethereum wallets.
- **IPFS or Filecoin** (Optional): For decentralized storage.
- **Solidity Compiler**: Built into Truffle, no need for separate installation.

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/kyc-blockchain-system.git
   cd kyc-blockchain-system
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Compile the smart contracts:

   ```
   truffle compile
   ```

4. Migrate the contracts to the local blockchain (Ganache):

   ```
   truffle migrate
   ```

5. Run the React frontend:

   ```
   npm start
   ```

### Configuration

Update the following configuration files:

- **`truffle-config.js`**: Ensure the correct network configurations for development, testing, or deployment (such as on Rinkeby, Mainnet, etc.).
- **Decentralized Storage**: If using IPFS/Filecoin, set up the storage connection in the backend.

## Smart Contracts

### KYCVerification.sol

The `KYCVerification.sol` smart contract contains functions to:

- Add new users and store their KYC details.
- Verify user details through authorized entities.
- Allow users to grant and revoke access to their KYC documents.
- Store metadata and hash pointers to documents stored in decentralized storage (like IPFS).

The test suite is located in the `test/` folder and includes tests for user registration, KYC verification, access control, and more.

## Deployment

To deploy the smart contracts to a public Ethereum network, such as Rinkeby or Mainnet, update the `truffle-config.js` file with the appropriate network settings, and use the following command:

```bash
truffle migrate --network rinkeby
```

You will need an Ethereum wallet (like MetaMask) and some test Ether to deploy on test networks like Rinkeby.

## Future Improvements

- **Integration with Government Databases**: To further automate the verification process.
- **Support for Multiple Blockchains**: Extend the system to support other blockchain platforms like Polkadot, Binance Smart Chain, etc.
- **Decentralized Identity (DID)**: Use decentralized identity standards for secure and self-sovereign identity management.
- **Advanced Privacy Features**: Leverage zk-SNARKs or other privacy-preserving technologies for selective document disclosure.
