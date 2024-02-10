"use client";
import Web3 from "web3";
import { IPFSHTTPClient, create } from "kubo-rpc-client";
import { useState, FormEvent, useEffect, useRef } from "react";
import Playlist from "@/build/contracts/PlayList.json";
export default function Home() {
  const [selectedVideoFile, setSelectedVideoFile] = useState();
  const [selectedImageFile, setSelectedImageFile] = useState();
  const [title, setTitle] = useState<String>();
  const [desc, setDesc] = useState<String>();
  const [ipfs, setIpfs] = useState<IPFSHTTPClient>();
  const videoRef = useRef<HTMLVideoElement>();
  const imageRef = useRef();

  useEffect(() => {
    const init = async () => {
      // const client = create(new URL("http://127.0.0.1:5001"));
      const client = create({ url: "http://127.0.0.1:5001" });
      setIpfs(client);
    };
    init();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const web3 = new Web3(window.ethereum);
    const tmp = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(tmp);
    // https://stackoverflow.com/questions/73838680/unable-to-call-function-from-smart-contract-using-web3-js
    const project = new web3.eth.Contract(
      Playlist.abi,
      Playlist.networks[5777].address,
    );

    if (!ipfs) return;
    const reader = new window.FileReader();
    if (!selectedVideoFile) return;
    reader.readAsArrayBuffer(selectedVideoFile);
    reader.onloadend = async () => {
      const { path } = await ipfs.add(reader.result as ArrayBuffer);
      console.log(path);
      const site = `https://ipfs.io/ipfs/${path}/`;
      console.log(site);
      if (videoRef.current) {
        videoRef.current.src = site;
      }
    };

    const imgReader = new window.FileReader();
    if (!selectedImageFile) {
      console.log("not selected image");
    } else {
      imgReader.readAsArrayBuffer(selectedImageFile);
      imgReader.onloadend = async () => {
        const { path } = await ipfs.add(imgReader.result as ArrayBuffer);
        console.log(path);
        const site = `https://ipfs.io/ipfs/${path}/`;
        console.log(site);
        if (imageRef.current) {
          imageRef.current.src = site;
        }
      };
    }
    const retailer = await project.methods.isExisting();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <img ref={imageRef}></img>
      <video ref={videoRef} controls></video>
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
        <button type="submit">Upload Your Video</button>
      </form>
    </main>
  );
}
