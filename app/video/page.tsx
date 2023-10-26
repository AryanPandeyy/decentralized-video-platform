"use client";
import playlist from "@/build/contracts/PlayList.json";
import { useEffect } from "react";
import Web3 from "web3";

export default function Video() {
  const web3 = new Web3(window.ethereum);
  console.log("ETH PROVIDER ", web3.eth);
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

  useEffect(() => {
    init();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl">Decentralized Video Sharing Platform</h1>
    </main>
  );
}
