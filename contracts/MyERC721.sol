// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@imtbl/zkevm-contracts/contracts/token/erc721/ImmutableERC721Preset.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IERC721Swappable.sol";

contract MyERC721 is ImmutableERC721Preset, IERC721Swappable {
    constructor(
        address owner,
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractURI
    ) ImmutableERC721Preset(owner, name, symbol, baseURI, contractURI) {}

    // SWAPPABLE EXTENSION
    function _beforeSwapForToken(
        uint[] memory,
        uint,
        address
    ) internal view override {
        // By default only allow minter to all the swap functions
        // Can be overridden with more custom functionality
        require(hasRole("MINTER", msg.sender), "Caller must be current owner");
    }

    function _beforeSwapForNFT(
        uint[] memory,
        uint,
        address
    ) internal view override {
        // By default only allow minter to all the swap functions
        // Can be overridden with more custom functionality
        require(hasRole("MINTER", msg.sender), "Caller must be current owner");
    }

    function _burnAll(uint[] memory ids, address requiredOwner) internal {
        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];

            require(
                _ownerOf(id) == requiredOwner,
                "to address must own all tokenIDs"
            );
            // Use private burn method to skip ownership check (burn checks that msg.sender is owner)
            _burn(id);
        }
    }

    function swapForToken(
        uint[] memory ids,
        uint amount,
        address to
    ) public override {
        _beforeSwapForToken(ids, amount, to);
        _burnAll(ids, to);

        // Transfer `amount` to the owner of the NFTs
        IERC20 token = IERC20(swapToken);
        token.transfer(to, amount);
        emit SwapForToken(ids, amount, to);
    }

    function swapForNFT(
        uint[] memory ids,
        uint forNFT,
        address to
    ) public override {
        _beforeSwapForNFT(ids, forNFT, to);
        _burnAll(ids, to);

        // Mint token to burner
        _mint(to, forNFT);
        emit SwapForNFT(ids, forNFT, to);
    }
}
