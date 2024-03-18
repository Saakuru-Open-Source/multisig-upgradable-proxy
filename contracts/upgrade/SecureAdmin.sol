// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "../core/MultiSigControlled.sol";


contract SecureAdmin is ProxyAdmin, MultiSigControlled {
    uint256 public requestCounter = 0;

    struct UpgradeProposal {
        address[] participants;
        ITransparentUpgradeableProxy proxyAddress;
        address newImplementation;
        bool valid;
    }

    mapping(uint256 => UpgradeProposal) public upgradeProposals;

    constructor(
        address owner_,
        address[] memory validators_
    ) {
      transferOwnership(owner_);
      _createInitialValidators(validators_);
    }

    function getProposal(uint256 proposalId_) public view returns(UpgradeProposal memory) {
        return upgradeProposals[proposalId_];
    }

    function createUpgradeProposal(ITransparentUpgradeableProxy proxyAddress_, address newImplementation_) public nonReentrant onlyAdmin {
        require(newImplementation_ != address(0), "MultiSigControlled: Zero address");
        require(super.getProxyImplementation(proxyAddress_) != address(0), "MultiSigControlled: Proxy doesn't exists");
        require(super.getProxyImplementation(proxyAddress_) != newImplementation_, "MultiSigControlled: already implemented");
        requestCounter = requestCounter + 1;
        address[] memory participants_ = new address[](1);
        participants_[0] = msg.sender;
        upgradeProposals[requestCounter] = UpgradeProposal(
            participants_,
            proxyAddress_,
            newImplementation_,
            true
        );
    }   

    function approveUpgradeProposal(uint256 proposalId_) public nonReentrant onlyAdmin {
        UpgradeProposal memory proposal_ = upgradeProposals[proposalId_];
        require(proposal_.participants.length > 0 && proposal_.valid, "Secure Admin: Proposal is not valid");
        for (uint256 i = 0; i < proposal_.participants.length; i++) {
            require(proposal_.participants[i] != msg.sender, "Secure Admin: Already approved by this validator");
        }
        upgradeProposals[proposalId_].participants.push(msg.sender);
        if(upgradeProposals[proposalId_].participants.length == multiSigTreshold) {
            proposal_.proxyAddress.upgradeTo(proposal_.newImplementation);
            upgradeProposals[proposalId_].valid = false;
        }
    }

    /**
     * @dev override to add multiSigControlled
     */
    function upgrade(ITransparentUpgradeableProxy proxy_, address implementation_) override public virtual onlyOwner {
        return;
    }

}
