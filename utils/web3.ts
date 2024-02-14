import Web3 from "web3";
import Playlist from "@/build/contracts/PlayList.json";

// https://stackoverflow.com/questions/73838680/unable-to-call-function-from-smart-contract-using-web3-js
export const loadBlockChainData = async () => {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const networkID = await web3.eth.net.getId();
    const signer = web3.eth.accounts.sign;
    const contract = new web3.eth.Contract(
      Playlist.abi,
      Playlist.networks[5777].address,
    );
    return { accounts, networkID, contract, Playlist };
  } catch (e) {
    console.log("ERROR: ", e);
  }
};
