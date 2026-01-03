// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KYCRegistry
 * @notice Simple registry for KYC-verified addresses
 */
contract KYCRegistry is Ownable {
    mapping(address => bool) private verified;

    event UserVerified(address indexed user);
    event UserRevoked(address indexed user);

    constructor() Ownable(msg.sender) {}

    function verifyUser(address _user) external onlyOwner {
        verified[_user] = true;
        emit UserVerified(_user);
    }

    function revokeUser(address _user) external onlyOwner {
        verified[_user] = false;
        emit UserRevoked(_user);
    }

    function isVerified(address _user) external view returns (bool) {
        return verified[_user];
    }
}
