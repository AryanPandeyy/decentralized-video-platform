"use client";
import { useState, FormEvent, useEffect, useRef } from "react";
import { IPFSHTTPClient, create } from "kubo-rpc-client";
import Playlist from "@/build/contracts/PlayList.json";
import { isUser } from "@/utils/isUser";
import { ethers } from "ethers";

export default function Home() {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File>();
  const [selectedImageFile, setSelectedImageFile] = useState<File>();
  const [thumbHash, setThumbHash] = useState<string>("");
  const [videoHash, setVideoHash] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [ipfs, setIpfs] = useState<IPFSHTTPClient>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const user = isUser();

  useEffect(() => {
    const init = async () => {
      const client = create({ url: "http://127.0.0.1:5001" });
      setIpfs(client);
    };

    init();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!ipfs) return;

    const reader = new window.FileReader();
    if (!selectedVideoFile) return;
    reader.readAsArrayBuffer(selectedVideoFile);

    reader.onloadend = async () => {
      const { path } = await ipfs.add(reader.result as ArrayBuffer);
      console.log(path);
      setVideoHash(path);
      const site = `https://ipfs.io/ipfs/${path}/`;
      console.log(site);
      if (videoRef.current) {
        videoRef.current.src = site;
      }
    };

    const imgReader = new window.FileReader();
    if (!selectedImageFile) return;
    imgReader.readAsArrayBuffer(selectedImageFile);

    imgReader.onloadend = async () => {
      const { path } = await ipfs.add(imgReader.result as ArrayBuffer);
      console.log(path);
      const site = `https://ipfs.io/ipfs/${path}/`;
      setThumbHash(path);
      console.log(site);
      if (imageRef.current) {
        imageRef.current.src = site;
      }
    };
  }

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
          onChange={(e) => {
            if (e.target.files) setSelectedVideoFile(e.target.files[0]);
          }}
        />
        <input
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-opacity-80"
          type="file"
          onChange={(e) => {
            if (e.target.files) setSelectedImageFile(e.target.files[0]);
          }}
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
