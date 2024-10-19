// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract KYCVerification {
    mapping(string => bool) private verifiedUsers;

    event UserVerified(string indexed aadharNumber, bool verified);

    function verifyUser(string memory aadharNumber) public {
        // Mark user as verified
        verifiedUsers[aadharNumber] = true;
        emit UserVerified(aadharNumber, true);
    }

    function isUserVerified(string memory aadharNumber) public view returns (bool) {
        return verifiedUsers[aadharNumber];
    }
}
