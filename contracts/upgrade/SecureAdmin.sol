// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

import "../core/MultiSigControlled.sol";

contract SecureAdmin is ProxyAdmin, MultiSigControlled {
    constructor(
        address owner_,
        address[] memory validators_
    ) {
      transferOwnership(owner_);
      _createInitialValidators(validators_);
    }

    function createUpgradeProposal(TransparentUpgradeableProxy proxy_, address contract_) public onlyOwner {

    }

    /**
     * @dev override to add multiSigControlled
     */
    function upgrade(ITransparentUpgradeableProxy proxy_, address implementation_) override public virtual onlyOwner {
        // add multiSigControlled logic
        super.upgrade(proxy_, implementation_);
    }

}
