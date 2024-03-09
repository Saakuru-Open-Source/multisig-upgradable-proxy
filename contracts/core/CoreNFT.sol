// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./MultiSigControlled.sol";

abstract contract CoreNFT is ERC721, ERC721Enumerable, ReentrancyGuard, MultiSigControlled {
    uint256 public _tokenIdTracker;
    
    string private _uri;
    string private _initName;
    string private _initSymbol;

    mapping(uint256 => string) private _tokenURIs;

    function name() public view override returns (string memory) {
        return _initName;
    }

    function symbol() public view override returns (string memory) {
        return _initSymbol;
    }

    function _mint(address account_, string memory uri_) internal{
        require(account_ != address(0), "CoreAttribute: mint to the zero address");
        _tokenIdTracker = _tokenIdTracker + 1;
        uint256 _tokenId = _tokenIdTracker;
        _safeMint(account_, _tokenId);
        _setURI(_tokenId, uri_);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {   
        return _tokenURIs[tokenId];
    }

    function _setName(string memory name_) internal {
        _initName = name_;
    }

    function _setSymbol(string memory symbol_) internal {
        _initSymbol = symbol_;
    }

    function _setURI(uint256 tokenId_, string memory uri_) internal {
        _tokenURIs[tokenId_] = uri_;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from, 
        address to, 
        uint256 firstTokenId, 
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
}
