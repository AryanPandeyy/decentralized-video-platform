import { ethers } from "ethers";
import Playlist from "@/build/contracts/PlayList.json";

// const init = async () => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   await provider.send("eth_requestAccounts", []);
//   const signer = await provider.getSigner();
//   const contract = new ethers.Contract(
//     Playlist.networks[5777].address,
//     Playlist.abi,
//     signer,
//   );
// };

export async function GET() {
  // const data = { a: "a" };
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  // await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    Playlist.networks[5777].address,
    Playlist.abi,
    signer,
  );
  // const data = await contract.getVideos();
  const data = await contract.addVideo("b", "b", "b", "b");
  console.log(data);
  // const data = { a: "a" };
  // return Response.json({ data });
  // return "hello";
  return Response.json({ a: "a" });
}
