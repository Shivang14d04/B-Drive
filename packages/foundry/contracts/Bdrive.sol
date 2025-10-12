// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Bdrive {
    error FileNameRequired();
    error FileCIDRequired();
    error FileDoesNotExist();

    struct File {
        string name;
        string cid;
        address owner;
        uint256 timestamp;
    }

    uint256 public fileCount;

    mapping(uint256 => File) public files;
    mapping(address => uint256[]) public OwnerFiles;

    event FileUploaded(uint256 indexed fileId, address indexed owner, string name, string cid, uint256 timestamp);

    function uploadFile(string memory _name, string memory _cid) external {
        if (bytes(_name).length == 0) revert FileNameRequired();
        if (bytes(_cid).length == 0) revert FileCIDRequired();

        files[fileCount] = File({ name: _name, cid: _cid, owner: msg.sender, timestamp: block.timestamp });

        OwnerFiles[msg.sender].push(fileCount);

        emit FileUploaded(fileCount, msg.sender, _name, _cid, block.timestamp);
        fileCount++;
    }

    function getFile(uint256 _fileId) external view returns (File memory) {
        if (_fileId >= fileCount) revert FileDoesNotExist();
        return files[_fileId];
    }

    function getAllFilesOfaUser(address _owner) external view returns (File[] memory) {
        uint256[] memory ids = OwnerFiles[_owner];

        File[] memory result = new File[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = files[ids[i]];
        }
        return result;
    }
}
