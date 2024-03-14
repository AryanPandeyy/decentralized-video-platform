"use client";

import { isUser } from "@/utils/isUser";
import { useState } from "react";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const user = isUser();

  const handleSignOut = () => {
    window.localStorage.removeItem("userAddress");
  };

  return (
    <nav className="bg-white text-black p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <a href="/">
          <img src="/blockchain.jpg" alt="Logo" className="h-8 w-8" />
        </a>
        <h1 className="text-lg font-semibold">DVSP</h1>
      </div>
      <ul className="flex space-x-4">
        {user ? (
          <>
            <li>
              <button onClick={handleSignOut} className="text-lg">
                Logout
              </button>
            </li>
            <li>
              <a href="/video" className="text-lg">
                Videos
              </a>
            </li>
            <li>
              <a href="#" className="text-lg">
                My Videos
              </a>
            </li>
            <li>
              <a href="/upload" className="text-lg">
                Upload
              </a>
            </li>
          </>
        ) : (
          <li>
            <a href="/signin" className="text-lg">
              Sign In
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
