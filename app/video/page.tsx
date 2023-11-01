"use client";
import playlist from "@/build/contracts/PlayList.json";
import { useEffect, useState } from "react";
import { create } from "kubo-rpc-client";
import Web3 from "web3";

export default function Video() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const web3 = new Web3(window.ethereum);
  console.log("ETH PROVIDER ", web3.eth);
  const ipfsClient = create(new URL("http://127.0.0.1:5001"));
  const init = async (): Promise<void> => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const id = await web3.eth.net.getId();
    console.log("ID ", id);
    console.log("Account Address ", accounts);
    const playListFunciton = new web3.eth.Contract(
      playlist.abi,
      playlist.networks[id].address,
    );
    const result = await playListFunciton.methods.myFunction().call();
    console.log("RESULT ", result);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      // const { path, cid, size } = await ipfsClient.add("test");
      // console.log(path);
      const result = ipfsClient.cat(
        "QmRf22bZar3WKmojipms22PkXH1MZGmvsqzQtuSvQE3uhm",
      );
      for await (const num of result) {
        console.log(num)
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl">Decentralized Video Sharing Platform</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
}
