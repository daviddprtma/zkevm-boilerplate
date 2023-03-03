// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./1_ImmutableERC721Preset.sol";

contract MyRoubbler is ImmutableERC721Preset {
    mapping(uint256 => uint8) public strength;
    // 1000000000000000 wei
    uint256 constant MINT_PRICE = 0.001 ether;
    uint256 constant VIP_PRICE = 0.01 ether;
    uint256 counter;
    address private _owner;

    constructor(
        address owner,
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractURI
    ) ImmutableERC721Preset(owner, name, symbol, baseURI, contractURI) {
        _owner = owner;
        counter = 0;
    }

    // Mint takes 0.001 Eth and mints a strength 1 roubbler to the account
    // The eth is sent directly
    function mint() external payable returns (uint256) {
        require(msg.value >= MINT_PRICE, "Mint price is 0.001 eth");
        payable(_owner).transfer(msg.value);
        uint256 tokenId = super._mintNextToken(msg.sender);
        strength[tokenId] = 5;
        return tokenId;
    }

    function growOrShrink(uint256 tokenId) external payable returns (bool) {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Need to own the Roubbler");
        require(msg.value >= MINT_PRICE, "Grow price is 0.001 eth");
        payable(_owner).transfer(msg.value);

        // random
        if (randomNumber() % 100 <= 49) {
            grow(tokenId);
            return true;
        } else {
            shrink(tokenId);
            return false;
        }
    }

    function grow(uint256 tokenId) internal {
        strength[tokenId] ++;
    }

    function shrink(uint256 tokenId) internal {
        strength[tokenId] --;
        if (strength[tokenId] == 0) {
            _burn(tokenId);
        }
    }

    function vipGrow(uint256 tokenId) external payable {
        require(msg.value >= VIP_PRICE, "VIP Grow price is 0.01 eth");
        payable(_owner).transfer(msg.value);
        grow(tokenId);
    }

    // Randomness provided by this is predicatable. Use with care!
    function randomNumber() public returns (uint) {
        counter ++;
        return uint(keccak256(abi.encodePacked(counter)));
    }
}
