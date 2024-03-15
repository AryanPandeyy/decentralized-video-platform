"use client";
import { ethers } from "ethers";
import Playlist from "@/build/contracts/PlayList.json";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const VideoPage = () => {
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const contract = new ethers.Contract(
        Playlist.networks[5777].address,
        Playlist.abi,
        provider,
      );
      const data = await contract.getVideos();
      console.log(data);
      setVideoData(data);
    };
    init();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videoData.map((video) => (
          <Link
            key={video[0]}
            href={`video/${video[0]}`}
            className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
          >
            <img
              className="w-full"
              src={`https://gateway.pinata.cloud/ipfs/${video[4]}`}
              alt="Video thumbnail"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{video[3]}</div>
              <p className="text-gray-700 text-base">Creator: {video[1]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;
