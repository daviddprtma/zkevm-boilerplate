// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./access/IERC173.sol";

// @dev exposes functions to setup trusted entities (settlement contracts)
// that are assured to enforce royalties
interface ITrustedContractRegistry is IERC173 {
    // RegistrationUpdated
    event RegistrationUpdated(address indexed entity, bool status);

    // register an entity as a trusted party
    function register(address entity) external;

    // unregister removes an entity as a trusted party
    function unregister(address entity) external;

    function isRegistered(address entity) external returns (bool);
}
