"use client";
import { loadBlockChainData } from "@/utils/web3";

const SignIn = () => {
  const init = async () => {
    const blockchainAccount = await loadBlockChainData();
    window.localStorage.setItem("userAddress", blockchainAccount.accounts[0]);
  };
  const logout = () => {
    window.localStorage.removeItem("userAddress");
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={init}>Login & Save ETH Address</button>
      <br />
      <button onClick={logout}>logout</button>
    </div>
  );
};
export default SignIn;
