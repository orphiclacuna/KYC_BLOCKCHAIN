// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract KYCVerification {
    struct User {
        string aadharNumber;
        string name;
        uint256 dob; // Date of Birth as timestamp
        bool isVerified;
    }

    mapping(address => User) public users;
    address public admin;

    event VerificationRequested(address indexed user, string aadharNumber);
    event UserVerified(address indexed user, string aadharNumber);

    constructor() {
        admin = msg.sender; // The account deploying the contract is the admin
    }

    // Function for users to request verification
    function requestVerification(string memory aadharNumber, string memory name, uint256 dob) public {
        require(bytes(aadharNumber).length == 16, "Aadhar number must be 16 digits");
        require(users[msg.sender].dob == 0, "Verification already requested");
        
        users[msg.sender] = User(aadharNumber, name, dob, false);
        emit VerificationRequested(msg.sender, aadharNumber);
    }

    // Admin function to verify a user
    function verifyUser(address userAddress) public {
        require(msg.sender == admin, "Only admin can verify users");
        require(users[userAddress].dob != 0, "User has not requested verification");
        
        users[userAddress].isVerified = true;
        emit UserVerified(userAddress, users[userAddress].aadharNumber);
    }

    // Function to check if a user is verified
    function isUserVerified(address userAddress) public view returns (bool) {
        return users[userAddress].isVerified;
    }
}
