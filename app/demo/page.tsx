"use client";
import { IPFSHTTPClient, create } from "kubo-rpc-client";
import { useState, FormEvent, useEffect, useRef } from "react";
export default function Home() {
  const [selectedFile, setSelectedFile] = useState();
  const [ipfs, setIpfs] = useState<IPFSHTTPClient>();
  const videoRef = useRef<HTMLVideoElement>();
  const imageRef = useRef();
  useEffect(() => {
    const init = async () => {
      const client = create(new URL("http://127.0.0.1:5001"));
      setIpfs(client);
    };
    init();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!ipfs) return;
    const reader = new window.FileReader();
    if (!selectedFile) return;
    reader.readAsArrayBuffer(selectedFile);
    reader.onloadend = async () => {
      const { path } = await ipfs.add(reader.result as ArrayBuffer);
      console.log(path);
      const site = `https://ipfs.io/ipfs/${path}/`;
      console.log(site);
      if (videoRef.current) {
        videoRef.current.src = site;
      }
    };
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setSelectedFile(e.target.files[0]);
            }
          }}
        />
        <button type="submit">Upload Your Video</button>
      </form>
      <img ref={imageRef}></img>
      <video ref={videoRef} controls></video>
    </main>
  );
}
