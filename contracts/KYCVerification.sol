// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract KYCVerification {
    struct User {
        string aadharNumber;
        string name;
        bool isVerified;
    }

    mapping(address => User) public users; // Store users' information by their address
    address public admin; // Admin address

    event VerificationRequested(address indexed user, string aadharNumber);
    event UserVerified(address indexed user, string aadharNumber);
    event VerificationDenied(address indexed user, string reason);

    constructor() {
        admin = msg.sender; // The account deploying the contract is the admin
    }

    // Admin function to verify a user
    function verifyUser(address userAddress) public {
        require(msg.sender == admin, "Only admin can verify users");
        require(!users[userAddress].isVerified, "User is already verified");

        users[userAddress].isVerified = true;
        emit UserVerified(userAddress, users[userAddress].aadharNumber);
    }

    // Function to deny verification with reason
    function denyVerification(address userAddress, string memory reason) public {
        require(msg.sender == admin, "Only admin can deny verification");
        require(!users[userAddress].isVerified, "User is already verified");

        emit VerificationDenied(userAddress, reason);
    }

    // Function to check if a user is verified
    function isUserVerified(address userAddress) public view returns (bool) {
        return users[userAddress].isVerified;
    }

    // Function to get user details (for admin purposes)
    function getUserDetails(address userAddress) public view returns (string memory, string memory, bool) {
        require(msg.sender == admin, "Only admin can view user details");
        User memory user = users[userAddress];
        return (user.aadharNumber, user.name, user.isVerified);
    }

    // Function for users to request verification
    function requestVerification(address userAddress, string memory aadharNumber, string memory name) public {
        require(msg.sender == userAddress, "Only user can request verification for themselves");
        require(bytes(aadharNumber).length == 16, "Aadhar number must be 16 digits");
        require(bytes(name).length > 0, "Name is required");
        require(!users[msg.sender].isVerified, "User already verified or request already made");

        users[msg.sender] = User(aadharNumber, name, false);
        emit VerificationRequested(msg.sender, aadharNumber);
    }
}
