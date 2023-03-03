// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ITrustedContractRegistry.sol";

contract TrustedContractRegistry is ITrustedContractRegistry {
    // contracts holds the registration status of different entities
    mapping(address => bool) public contracts;

    address private _registryOwner;

    constructor(address owner_){
        _registryOwner = owner_;
    }

    // isRegistered tells us whether an entity is registered or not
    function isRegistered(address entity) external view returns (bool) {
        return contracts[entity];
    }

    function register(address entity) external _onlyOwner {
        contracts[entity] = true;

        emit RegistrationUpdated(entity, true);
    }

    function unregister(address entity) external _onlyOwner {
        contracts[entity] = false;

        emit RegistrationUpdated(entity, false);
    }

    // ------- ERC173 implementation functions -----

    function owner() override view external returns(address) {
        return _registryOwner;
    }

    function transferOwnership(address _newOwner) override external _onlyOwner {
        require(_newOwner != address(0));

        _registryOwner = _newOwner;

        emit OwnershipTransferred(_registryOwner, _newOwner);
    }

    modifier _onlyOwner() {
        require(msg.sender == _registryOwner);
        _;
    }

    // ----- ERC165 impl functions ------------
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(IERC165)
    returns (bool)
    {
        if(interfaceId == 0x01ffc9a7) {
            return true;
        }

    return false;
    }

}
