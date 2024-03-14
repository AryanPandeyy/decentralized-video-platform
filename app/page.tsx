"use client";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl">Decentralized Video Sharing Platform</h1>
        <img
          src="/blockchain.jpg"
          alt="Blockchain"
          className="h-32 w-32 mb-8"
        />
        <blockquote className="text-center text-lg font-medium text-black">
          It's completely decentralized, with no central server or trusted
          parties, because everything is based on crypto proof instead of trust.
          - Satoshi Nakamoto
        </blockquote>
      </div>
      <footer className="w-full text-center p-4 text-black">
        Made using Blockchain, IPFS
      </footer>
    </div>
  );
}
