// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { Test } from "forge-std/Test.sol";
import { Bdrive } from "../contracts/Bdrive.sol";

contract BdriveTest is Test {
    Bdrive bdrive;
    address user1 = address(0x123);
    address user2 = address(0x456);

    function setUp() public {
        bdrive = new Bdrive();
    }

    function testUploadFile() public {
        vm.prank(user1);
        bdrive.uploadFile("file1.txt", "CID123");

        Bdrive.File memory f = bdrive.getFile(0);

        assertEq(f.name, "file1.txt");
        assertEq(f.cid, "CID123");
        assertEq(f.owner, user1);
        assertGt(f.timestamp, 0);
    }

    function testRevertWhenFileNameMissing() public {
        vm.prank(user1);
        vm.expectRevert(Bdrive.FileNameRequired.selector);
        bdrive.uploadFile("", "CID123");
    }

    function testRevertWhenCIDMissing() public {
        vm.prank(user1);
        vm.expectRevert(Bdrive.FileCIDRequired.selector);
        bdrive.uploadFile("file1.txt", "");
    }

    function testGetAllFilesOfUser() public {
        vm.startPrank(user1);
        bdrive.uploadFile("file1.txt", "CID1");
        bdrive.uploadFile("file2.txt", "CID2");
        vm.stopPrank();

        Bdrive.File[] memory files = bdrive.getAllFilesOfaUser(user1);
        assertEq(files.length, 2);
        assertEq(files[0].name, "file1.txt");
        assertEq(files[1].name, "file2.txt");
    }

    function testRevertForInvalidFileId() public {
        vm.expectRevert(Bdrive.FileDoesNotExist.selector);
        bdrive.getFile(99);
    }
}
