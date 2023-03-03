// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@imtbl/zkevm-contracts/contracts/token/erc721/ImmutableERC721Preset.sol";

// Crafting tokens and voting for the best one!
contract MyERC721 is ImmutableERC721Preset {

    struct CraftedToken {
        uint256[] tokenIds;
        uint256 votes;
        string name;
    }

    // Mapping to keep track of crafted tokens
    mapping(uint256 => bool) public crafted;
    // Mapping to keep track of votes for crafted tokens
    mapping(uint256 => CraftedToken) public craftedTokens;
    // Mapping to keep track of who has voted for a crafted token
    mapping(address => bool) private hasVoted;

    event TokenCrafted(
        address indexed owner,
        uint256 tokenId,
        uint256[] tokenIds
    );

    event TokenVoted(address indexed voter, uint256 indexed tokenId);

    constructor(
        address owner,
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractURI
    ) ImmutableERC721Preset(owner, name, symbol, baseURI, contractURI) {}

    // crafty time
    function craftToken(uint256[] memory tokenIds, string memory name) public {
        require(
            tokenIds.length >= 2,
            "Must provide at least 2 tokens to craft"
        );

        // Check that all tokens are owned by the same user
        address owner = ownerOf(tokenIds[0]);
        for (uint256 i = 1; i < tokenIds.length; i++) {
            require(
                ownerOf(tokenIds[i]) == owner,
                "All tokens must be owned by the same user"
            );
        }

        // Check that this combination of tokens has not already been crafted
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(!crafted[tokenIds[i]], "Cannot use the same token twice");
        }

        // Mint a new token and transfer ownership to the current user
        uint256 newTokenId = totalSupply() + 1;
        _safeMint(owner, newTokenId);

        // Mark all input tokens as crafted
        for (uint256 i = 0; i < tokenIds.length; i++) {
            crafted[tokenIds[i]] = true;
        }

        craftedTokens[newTokenId] = CraftedToken(tokenIds, 0, name);

        // Emit event for token crafted
        emit TokenCrafted(owner, newTokenId, tokenIds);
    }

    function voteForToken(uint256 tokenId, address voter) public {
        require(craftedTokenExists(tokenId), "There is no crafted token with this ID");
        require(!hasVoted[voter], "Already voted for this Token");
        // TODO: fix this hehe
        // require(ownerOf(tokenId) != voter, "Cannot vote for your own Token");
        require(balanceOf(voter) > 0, "You must own at least one Token to vote");

        // Increment vote count for Token and mark voter as having voted
        craftedTokens[tokenId].votes++;
        hasVoted[voter] = true;

        emit TokenVoted(voter, tokenId);
    }

    function getTokenDetails(uint256 tokenId)
        public
        view
        returns (CraftedToken memory)
    {
        require(craftedTokenExists(tokenId), "Token does not exist");

        CraftedToken memory token = craftedTokens[tokenId];

        return token;
    }

    function craftedTokenExists(uint256 tokenId) public view returns (bool) {
        return craftedTokens[tokenId].tokenIds.length > 0;
    }
}
