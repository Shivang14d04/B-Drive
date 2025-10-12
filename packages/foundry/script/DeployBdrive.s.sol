// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../contracts/Bdrive.sol";

contract DeployBdrive is Script {
    function run() external {
        // Load private key from env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        Bdrive bdrive = new Bdrive();

        vm.stopBroadcast();

        console.log("Bdrive deployed at:", address(bdrive));
    }
}
