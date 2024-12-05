// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract FakeENSRegistrar {
    mapping(address => uint256) public count;

    function increament1() public {
        count[msg.sender]++;
    }

    function increament2() public {
        count[msg.sender]++;
    }
}
