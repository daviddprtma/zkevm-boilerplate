// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IERC721Swappable {
    address public swapToken;

    function _beforeSwapForToken(
        uint[] memory,
        uint,
        address
    ) internal view virtual {}

    function _beforeSwapForNFT(
        uint[] memory,
        uint,
        address
    ) internal view virtual {}

    function swapForToken(
        uint[] memory ids,
        uint amount,
        address to
    ) public virtual {}

    function swapForNFT(
        uint[] memory ids,
        uint forNFT,
        address to
    ) public virtual {}
}
