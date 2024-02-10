// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.22 < 0.9.0;
pragma experimental ABIEncoderV2;

contract PlayList {
  struct video {
    uint id;
    address creator;
    string desc;
    string title;
    string thumbHash;
    string videoHash;
  } video[] public videoArray;
  function addVideo(string memory _thumbHash, string memory _videoHash,
                    string memory _title,
                    string memory _desc) public returns(bool) {
    if (isExisting(_thumbHash, _videoHash)) {
      return false;
    }
    uint _id = videoArray.length;
    videoArray.push(video({
      id : _id,
      title : _title,
      thumbHash : _thumbHash,
      videoHash : _videoHash,
      desc : _desc,
      creator : msg.sender
    }));
    return true;
  }
  function isExisting(string memory _thumbHash,
                      string memory _videoHash) public view returns(bool) {
    for (uint i = 0; i < videoArray.length; i++) {
      if (keccak256(abi.encodePacked(videoArray[i].thumbHash)) ==
              keccak256(abi.encodePacked(_thumbHash)) ||
          keccak256(abi.encodePacked(videoArray[i].videoHash)) ==
              keccak256(abi.encodePacked(_videoHash))) {
        return true;
      }
    }
    return false;
  }

  function getVideo(uint _id) public view returns(string memory) {
    return string(
        abi.encodePacked(videoArray[_id].title, "/", videoArray[_id].thumbHash,
                         "/", videoArray[_id].videoHash, "/",
                         videoArray[_id].desc, "/", videoArray[_id].creator));
  }

  function getVideos() public view returns(video[] memory) {
    return videoArray;
  }

  function getArrayLength() public view returns(uint) {
    return videoArray.length;
  }
}
