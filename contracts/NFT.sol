// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./core/CoreNFT.sol";

contract NFT is CoreNFT, Initializable {
    // solhint-disable-next-line
    constructor() ERC721("", "") {}

    /// @dev MUST call when proxy deployment
    function init(
        string memory name_,
        string memory symbol_,
        address owner_, 
        address[] memory admins_
    ) external initializer {
        if(bytes(name_).length > 0) _setName(name_);
        if(bytes(symbol_).length > 0)  _setSymbol(symbol_);
        if(owner() == address(0)) _transferOwnership(owner_);
        _createInitialValidators(admins_);
    }

    function mint(address account_, string memory uri_) external nonReentrant onlyOwner {
        _mint(account_, uri_);
    }
}
