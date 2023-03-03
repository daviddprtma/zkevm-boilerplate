// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./token/erc721/ImmutableERC721Preset.sol";
import "./ITrustedContractRegistry.sol";

contract OF721 is ImmutableERC721Preset {
    constructor(
        address owner,
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractURI,
        ITrustedContractRegistry registry_
    ) ImmutableERC721Preset(owner, name, symbol, baseURI, contractURI) {
        registry = ITrustedContractRegistry(registry_);
    }

    // fired when the registry contract is updated
    event RegistryUpdated(address indexed registry);

    ITrustedContractRegistry public registry;
//    address public _owner;

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ImmutableERC721Preset) {
        require(registry.isRegistered(to), "entity isn't registered");

        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // updateContractRegistry updates the contract registry for this ERC721 contract.
    function updateContractRegistry(address _newRegistry) external onlyRole(DEFAULT_ADMIN_ROLE) {
        registry = ITrustedContractRegistry(_newRegistry);

        emit RegistryUpdated(address(registry));
    }

//    modifier _onlyOwner() {
//        require(msg.sender == address(this._owner));
//        _;
//    }
}

