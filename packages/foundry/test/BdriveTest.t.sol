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
        assertEq(f.exists, true);
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
    }

    function testRevertForInvalidFileId() public {
        vm.expectRevert(Bdrive.FileDoesNotExist.selector);
        bdrive.getFile(99);
    }

    function testDeleteFile() public {
        vm.prank(user1);
        bdrive.uploadFile("file1.txt", "CID1");

        vm.prank(user1);
        bdrive.deleteFile(0);

        Bdrive.File[] memory files = bdrive.getAllFilesOfaUser(user1);
        assertEq(files.length, 0);

        vm.expectRevert(Bdrive.FileDoesNotExist.selector);
        bdrive.getFile(0);
    }

    function testDeleteFileByNonOwner() public {
        vm.prank(user1);
        bdrive.uploadFile("file1.txt", "CID1");

        vm.prank(user2);
        vm.expectRevert(Bdrive.NotFileOwner.selector);
        bdrive.deleteFile(0);
    }
}
