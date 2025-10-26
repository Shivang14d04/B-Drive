// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Bdrive {
    error FileNameRequired();
    error FileCIDRequired();
    error FileDoesNotExist();
    error NotFileOwner();

    struct File {
        string name;
        string cid;
        address owner;
        uint256 timestamp;
        bool exists;
    }

    uint256 public fileCount;

    mapping(uint256 => File) public files;
    mapping(address => uint256[]) public OwnerFiles;

    event FileUploaded(uint256 indexed fileId, address indexed owner, string name, string cid, uint256 timestamp);
    event FileDeleted(uint256 indexed fileId, address indexed owner);

    function uploadFile(string memory _name, string memory _cid) external {
        if (bytes(_name).length == 0) revert FileNameRequired();
        if (bytes(_cid).length == 0) revert FileCIDRequired();

        files[fileCount] = File({ name: _name, cid: _cid, owner: msg.sender, timestamp: block.timestamp, exists: true });

        OwnerFiles[msg.sender].push(fileCount);

        emit FileUploaded(fileCount, msg.sender, _name, _cid, block.timestamp);
        fileCount++;
    }

    function getFile(uint256 _fileId) external view returns (File memory) {
        File memory f = files[_fileId];
        if (!f.exists) revert FileDoesNotExist();
        return f;
    }

    function getAllFilesOfaUser(address _owner) external view returns (File[] memory) {
        uint256[] memory ids = OwnerFiles[_owner];
        uint256 count = 0;

        // Count existing files
        for (uint256 i = 0; i < ids.length; i++) {
            if (files[ids[i]].exists) count++;
        }

        File[] memory result = new File[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            if (files[ids[i]].exists) {
                result[j] = files[ids[i]];
                j++;
            }
        }

        return result;
    }

    function deleteFile(uint256 _fileId) external {
        File storage f = files[_fileId];
        if (!f.exists) revert FileDoesNotExist();
        if (f.owner != msg.sender) revert NotFileOwner();

        f.exists = false;

        emit FileDeleted(_fileId, msg.sender);
    }
}
