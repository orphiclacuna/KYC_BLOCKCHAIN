// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract KYCVerification {
    struct User {
        string aadharNumber;
        string ipfsHash; // Storing IPFS hash
        bool isVerified;
    }

    mapping(string => User) private users;

    event UserVerified(string indexed aadharNumber, string ipfsHash, bool verified);

    function verifyUser(string memory aadharNumber, string memory ipfsHash) public {
        // Store user details and mark them as verified
        users[aadharNumber] = User(aadharNumber, ipfsHash, true);
        emit UserVerified(aadharNumber, ipfsHash, true);
    }

    function isUserVerified(string memory aadharNumber) public view returns (bool) {
        return users[aadharNumber].isVerified;
    }

    function getUserIPFSHash(string memory aadharNumber) public view returns (string memory) {
        require(users[aadharNumber].isVerified, "User is not verified");
        return users[aadharNumber].ipfsHash;
    }
}
