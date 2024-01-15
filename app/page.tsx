"use client";

export default function Home() {
  if (window.ethereum) {
    return (
      <main className="flex px-20 flex-col items-center">
        <h1 className="absolute top-8 my-4">
          Decentralized Video Sharing Platform
        </h1>
        <br />
        <br />
        <ul className="my-48">
          <li>
            But wait there’s more: the flame thrower is sentient, its safe word
            is “cryptocurrency” and it comes with a free blockchain. - Elon Musk
          </li>
          <br />
          <li>
            It&apos;s completely decentralized, with no central server or
            trusted parties, because everything is based on crypto proof instead
            of trust. - Satoshi Nakamoto
          </li>
          <br />
          <li>
            I promise to pay the bearer the sum of <del>Rupees</del> Crypto
          </li>
        </ul>
        <footer className="absolute bottom-0 my-4">
          Made using BlockChain, IPFS
        </footer>
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
