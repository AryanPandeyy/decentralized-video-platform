"use client";
import { isUser } from "@/utils/isUser";
import { loadBlockChainData } from "@/utils/web3";
import Link from "next/link";
import { FC } from "react";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const user = isUser();

  if (user) {
    const handleLogOut = () => {
      window.localStorage.removeItem("userAddress");
      window.location.reload();
    };

    return (
      <div className="flex flex-row p-2 justify-between border-black border-b">
        <button onClick={handleLogOut}>LogOut</button>
        <div className="flex flex-row justify-between gap-4">
          <Link href="/videos">Videos</Link>
          <Link href="/subscribed">Subscribed</Link>
          <Link href="/videos">My Videos</Link>
          <Link href="/upload">Upload</Link>
        </div>
        <p>{user}</p>
      </div>
    );
  } else {
    const handleSignIn = async () => {
      const blockchainAccount = await loadBlockChainData();
      window.localStorage.setItem("userAddress", blockchainAccount.accounts[0]);

      window.location.reload();
    };

    return (
      <div className="flex flex-row p-2 justify-between border-black border-b">
        <button onClick={handleSignIn}>Sign In</button>
      </div>
    );
  }
};

export default Navbar;
