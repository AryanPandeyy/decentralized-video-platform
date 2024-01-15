import Web3 from "web3";

export const loadBlockChainData = async () => {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const networkID = await web3.eth.net.getId();
    return { accounts, networkID };
  } catch (e) {
    console.log("ERROR: ", e);
  }
};
