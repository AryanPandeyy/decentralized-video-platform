"use client";
import { IPFSHTTPClient, create } from "kubo-rpc-client";
import { useState, FormEvent, useEffect, useRef } from "react";
import { isUser } from "@/utils/isUser";
import { loadBlockChainData } from "@/utils/web3";
import { Contract, ContractAbi } from "web3";

interface ConType {
  accounts: string[];
  networkID: bigint;
  contract: Contract<ContractAbi>;
  Playlist: Object;
}

export default function Home() {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File>();
  const [selectedImageFile, setSelectedImageFile] = useState<File>();
  const [thumbHash, setThumbHash] = useState<string>("");
  const [web3, setWeb3] = useState<ConType>();
  const [videoHash, setVideoHash] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [ipfs, setIpfs] = useState<IPFSHTTPClient>();

  const videoRef = useRef<HTMLVideoElement>();
  const imageRef = useRef();
  const user = isUser();

  useEffect(() => {
    const init = async () => {
      const client = create({ url: "http://127.0.0.1:5001" });
      const con: ConType = await loadBlockChainData();
      setWeb3(con);
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
      setThumbHash(path);
      const site = `https://ipfs.io/ipfs/${path}/`;
      console.log(site);
      if (imageRef.current) {
        imageRef.current.src = site;
      }
    };
    console.log("log ", await web3?.contract.methods.getVideos().call());
  }

  const handleWeb3 = async (
    thumbHash: string,
    videoHash: string,
    title: string,
    desc: string,
  ) => {
    console.log(thumbHash, videoHash, title, desc);
    if (thumbHash && videoHash && title && desc) {
      await web3?.contract.methods
        .addVideo(thumbHash, videoHash, title, desc)
        .send({ from: `${user}` });
    }
    console.log("log ", await web3?.contract.methods.getVideos().call());
  };

  return (
    <div className="container flex flex-row gap-4 justify-center item-center border border-black p-20">
      <div>
        <img ref={imageRef}></img>
        <video ref={videoRef} controls></video>
      </div>
      <div className="container flex flex-col gap-4 m-20">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            placeholder="Video File"
            onChange={(e) => {
              if (e.target.files) {
                setSelectedVideoFile(e.target.files[0]);
              }
            }}
          />
          <br />
          <input
            type="file"
            placeholder="Video Image"
            onChange={(e) => {
              if (e.target.files) {
                setSelectedImageFile(e.target.files[0]);
              }
            }}
          />
          <br />
          <input
            value={title}
            placeholder="Video Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <br />
          <input
            value={desc}
            placeholder="Video Description"
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
          <br />
          <button type="submit">Upload Your Video</button>
        </form>
      </div>
    </div>
  );
}
