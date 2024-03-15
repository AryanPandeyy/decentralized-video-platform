"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Playlist from "@/build/contracts/PlayList.json";

const VideoPage = ({ params }: { params: { videoID: number } }) => {
  const [videoData, setVideoData] = useState([]);
  useEffect(() => {
    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        Playlist.networks[5777].address,
        Playlist.abi,
        provider,
      );
      const data = await contract.getVideo(params.videoID);
      setVideoData(data);
    };
    init();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mb-8">
        <video
          src={`https://gateway.pinata.cloud/ipfs/${videoData[5]}`}
          controls
          className="w-full h-auto"
        ></video>
        <div className="mt-2">
          <h2 className="text-2xl font-bold">{videoData[3]}</h2>
          <p className="text-md text-gray-700">Created by: {videoData[1]}</p>
          <p className="text-md mt-2">{videoData[2]}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
