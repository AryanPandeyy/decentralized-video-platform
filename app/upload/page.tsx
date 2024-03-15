"use client";
import { useState, FormEvent, useEffect, useRef } from "react";
import Playlist from "@/build/contracts/PlayList.json";
import { isUser } from "@/utils/isUser";
import { ethers } from "ethers";
import axios from "axios";

export default function Home() {
  const [selectedVideoFile, setSelectedVideoFile] = useState();
  const [selectedImageFile, setSelectedImageFile] = useState();
  const [thumbHash, setThumbHash] = useState<string>("");
  const [videoHash, setVideoHash] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const user = isUser();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const videoData = new FormData();
    videoData.append("file", selectedVideoFile);
    const resVideoFile = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      videoData,
      {
        headers: {
          maxBodyLength: "Infinity",
          Authorization: `Bearer ${JWT}`,
          "Content-Type": `video/mpv`,
        },
      },
    );

    const imageData = new FormData();
    imageData.append("file", selectedImageFile);
    const resImageFile = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      imageData,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": `image/jpeg`,
        },
      },
    );
    console.log(resVideoFile.data.IpfsHash);
    console.log(resImageFile.data.IpfsHash);
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      Playlist.networks[5777].address,
      Playlist.abi,
      signer,
    );
    const data = await contract.addVideo(
      resImageFile.data.IpfsHash,
      resVideoFile.data.IpfsHash,
      title,
      desc,
    );
    console.log(data);
  }

  const setVideoFileState = (e) => {
    if (!e.target.files) return;
    const data = e.target.files[0];
    console.log("DATA chnage State ", data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setSelectedVideoFile(e.target.files[0]);
    };
    e.preventDefault();
  };

  const setImageFileState = (e) => {
    if (!e.target.files) return;
    const data = e.target.files[0];
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = async () => {
      setSelectedImageFile(e.target.files[0]);
    };
    e.preventDefault();
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center space-y-6">
      <div>
        <img
          ref={imageRef}
          className="w-96 h-56 object-cover"
          alt="Thumbnail preview"
        />
        <video ref={videoRef} controls className="mt-2 w-96 h-56"></video>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        <input
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-opacity-80"
          type="file"
          onChange={setVideoFileState}
        />
        <input
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-opacity-80"
          type="file"
          onChange={setImageFileState}
        />
        <input
          className="py-2 px-4 border rounded"
          value={title}
          placeholder="Video Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="py-2 px-4 border rounded"
          value={desc}
          placeholder="Video Description"
          rows={3}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="py-2 px-4 bg-black text-white font-semibold rounded hover:bg-opacity-80"
        >
          Upload Your Video
        </button>
      </form>
    </div>
  );
}
