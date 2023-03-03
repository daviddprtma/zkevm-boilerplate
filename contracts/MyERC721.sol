// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./ImmutableERC721Preset.sol";
import "@imtbl/zkevm-contracts/contracts/token/erc721/ImmutableERC721Preset.sol";

contract MyRoubbler is ImmutableERC721Preset {
    mapping(uint256 => uint8) public strength;
    // 1000000000000000 wei
    uint256 constant MINT_PRICE = 0.001 ether;
    uint256 constant VIP_PRICE = 0.01 ether;
    // for remix dev rand
    // uint256 counter;
    address private _owner;

    constructor(
        address owner,
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractURI
    ) ImmutableERC721Preset(owner, name, symbol, baseURI, contractURI) {
        _owner = owner;
        // counter = 0;
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
            grow(tokenId, 1);
            return true;
        } else {
            shrink(tokenId, 1);
            return false;
        }
    }

    function attack(uint256 attackerTokenID, uint256 defenderTokenID) external returns (bool) {
        require(_isApprovedOrOwner(msg.sender, attackerTokenID), "Need to own the Roubbler");

        // logic for deciding the battle winner
        uint256 attackerStrength = strength[attackerTokenID];
        uint256 defenderStrength = strength[defenderTokenID];

        if ((randomNumber() % 10) + (attackerStrength - defenderStrength) >= 5) {
            // attacker wins
            grow(attackerTokenID, 1);
            shrink(defenderTokenID, 1);
            return true;
        } else {
            // defender wins
            grow(defenderTokenID, 1);
            shrink(attackerTokenID, 2);
            return false;
        }
    }

    function grow(uint256 tokenId, uint8 amount) internal {
        strength[tokenId] = strength[tokenId] + amount;
    }

    function shrink(uint256 tokenId, uint8 amount) internal {
        strength[tokenId] = strength[tokenId] - amount;
        if (strength[tokenId] <= 0) {
            _burn(tokenId);
        }
    }

    function vipGrow(uint256 tokenId) external payable {
        require(msg.value >= VIP_PRICE, "VIP Grow price is 0.01 eth");
        payable(_owner).transfer(msg.value);
        grow(tokenId, 1);
    }

    function randomNumber() internal view returns (uint) {
        return uint(blockhash(block.number - 1));
    }   
    
    // Randomness provided by this is predicatable. Use with care!
    // Remix dev
    // function randomNumber() public returns (uint) {
    //     counter ++;
    //     return uint(keccak256(abi.encodePacked(counter)));
    // }
}
