"use client";
import Playlist from "@/build/contracts/PlayList.json";

const SignIn = () => {
  const handleLogin = () => {
    window.localStorage.setItem("userAddress", Playlist.networks[5777].address);
  };

  // useEffect(() => {
  //   const init = async () => {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     await provider.send("eth_requestAccounts", []);
  //     const signer = await provider.getSigner();
  //     const contract = new ethers.Contract(
  //       Playlist.networks[5777].address,
  //       Playlist.abi,
  //       signer,
  //     );
  //   };
  // }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold mb-8">Login</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mb-4"
        onClick={handleLogin}
      >
        Login & Save ETH Address
      </button>
      <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg">
        Logout
      </button>
    </div>
  );
};
export default SignIn;
