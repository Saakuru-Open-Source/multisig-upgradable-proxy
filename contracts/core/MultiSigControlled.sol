// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IMultiSigControlled {
    event ECreateProposition(address indexed sender, address indexed validator, bool action);
    event EApprovedProposition(address indexed sender, address indexed validator, uint256 count);
    event EAdminAdded(address indexed validator);
}

abstract contract MultiSigControlled is IMultiSigControlled, Ownable {
    uint256 constant multiSigTreshold = 2;
    uint256 constant maxValidators = 5;
    
    struct Proposal {
        address[] participants;
        bool action;
    }
    mapping(address => bool) private validators;
    bool private initialized;
    mapping(address => Proposal) private proposals;

    function _createInitialValidators(address[] memory addresses_) internal {
        require(addresses_.length >= multiSigTreshold, "MultiSigControlled: Insufficent number of validators provided");
        require(addresses_.length <= maxValidators, "MultiSigControlled: Too many validators provided");
        require(!initialized, "MultiSigControlled: Already initialized");
        for (uint256 i = 0; i < addresses_.length; i++) {
            require(!isAdmin(addresses_[i]), "MultiSigControlled: Duplicated validator");
            require(addresses_[i] != address(0), "MultiSigControlled: Zero address");
            require(addresses_[i] != owner(), "MultiSigControlled: Owner cannot be validator");
             _modifyAdmin(addresses_[i], true);
        }
        initialized = true;
    }
    /** 
        creating proposition to add new validator
    */
    function createAdminProposal(address validator_, bool action_) public onlyOwner {
        Proposal memory proposal_ = proposals[validator_];
        require(proposal_.participants.length == 0, "MultiSigControlled: Already exists");
        address[] memory participants_ = new address[](1);
        participants_[0] = msg.sender;
        proposals[validator_] = Proposal(
            participants_,
            action_
        );
        emit ECreateProposition(msg.sender, validator_, action_);
    }

    /** 
        approve validator proposal
    */
    function approveAdminProposal(address validator_) public onlyAdmin {
        Proposal memory proposal_ = proposals[validator_];
        require(proposal_.participants.length > 0, "MultiSigControlled: Proposal is not created");
        for (uint256 i = 0; i < proposal_.participants.length; i++) {
            require(proposal_.participants[i] != msg.sender, "MultiSigControlled: Already approved by this validator");
        }
        emit EApprovedProposition(msg.sender, validator_, proposal_.participants.length + 1);
        // to avoid additional gas consumption, executing validation before writing to storage
        if (proposal_.participants.length == multiSigTreshold - 1) {
            proposals[validator_] = Proposal(
                new address[](0),
                false
            );
            _modifyAdmin(validator_,  proposal_.action);
            emit EAdminAdded(validator_);
            return;
        }
        address[] memory participants_ = new address[](proposal_.participants.length + 1);
        participants_[proposal_.participants.length] = msg.sender;
        proposals[validator_] = Proposal(
            participants_,
            proposal_.action
        );
    }

    function _modifyAdmin(address validator_, bool value_) private {
        validators[validator_] = value_;
    }

    function proposition(address validator_) public view returns (Proposal memory) {
        return proposals[validator_];
    }

    function isAdmin(address account_) public view returns (bool) {
        return validators[account_];
    }

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "MultiSigControlled: Not allowed");
        _;
    }
}
