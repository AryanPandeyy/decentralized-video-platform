"use client";
export default function Home() {
  if (window.ethereum) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Decentralized Video Sharing Platform</h1>
        <p>Made using BlockChain, IPFS</p>
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>MetaMask not found</h1>
      </main>
    );
  }
}
