// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { Script, console } from "forge-std/Script.sol";
import { Bdrive } from "../contracts/Bdrive.sol";

contract DeployBdrive is Script {
    function run() external {
        vm.startBroadcast();
        Bdrive bdrive = new Bdrive();
        vm.stopBroadcast();

        console.log("Bdrive deployed at:", address(bdrive));
    }
}
