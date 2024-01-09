"use client";
import { Helia, createHelia } from "helia";
import React, { useState, useEffect, useRef } from "react";
import { webSockets } from "@libp2p/websockets";
import * as Filters from "@libp2p/websockets/filters";
import { tcp } from "@libp2p/tcp";
import { unixfs } from "@helia/unixfs";
import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { bootstrap } from "@libp2p/bootstrap";
import { createLibp2p } from "libp2p";

const IpfsComponent = () => {
  const [helia, setHelia] = useState<Helia>();
  const [previewImg, setPreviewImg] = useState();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedFile, setSelectedFile] = useState<any>();
  const handleUpload = async (e: Event) => {
    e.preventDefault();
    try {
      if (!helia) return;
      const fs = unixfs(helia);
      const reader = new window.FileReader();
      if (!selectedFile) return;
      reader.readAsArrayBuffer(selectedFile);
      reader.onloadend = async () => {
        if (!reader.result) return;
        const cid = await fs.addFile({
          content: new Uint8Array(reader.result as ArrayBuffer),
        });
        console.log(cid.toString());
        for await (const chunk of fs.cat(cid)) {
          console.log(chunk);
          const data = Buffer.from(chunk).toString("base64");
          setPreviewImg("data:image/png;base64," + data);
          const blob = new Blob([data], { type: "video/mp4" });
          console.log(blob);
          if (!videoRef.current) return;
          videoRef.current.src = URL.createObjectURL(blob);
          console.log(videoRef.current);
          console.log(URL.createObjectURL(blob));
        }
      };
      console.log(selectedFile);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      const blockstore = new MemoryBlockstore();
      const datastore = new MemoryDatastore();
      const libp2p = await createLibp2p({
        // ..other config
        transports: [
          webSockets({
            filter: Filters.all, // this is necessary to dial insecure websockets
          }),
          // other transports
        ],
        connectionGater: {
          denyDialMultiaddr: () => false, // this is necessary to dial local addresses at all
        },
        peerDiscovery: [
          bootstrap({
            list: [
              `/ip4/127.0.0.1/tcp/9096/ws/p2p/12D3KooWBxiPpEYAVVpgeKBmvM4goeTEtEhemTn1ayKV3DNUxMwL`,
            ],
          }),
        ],
      });
      // const libp2p = await createLibp2p({
      //   addresses: {
      //     listen: ["/ip4/0.0.0.0/tcp/0"],
      //   },
      //   transports: [tcp()],
      //   peerDiscovery: [
      //     bootstrap({
      //       list: [
      //         "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
      //         "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
      //         "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
      //         "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
      //       ],
      //     }),
      //   ],
      // });

      if (helia) return;

      const heliaNode = await createHelia({ libp2p });
      setHelia(heliaNode);
      console.log(heliaNode.libp2p.getMultiaddrs());

      const fs = unixfs(heliaNode);
      // we will use this TextEncoder to turn strings into Uint8Arrays
      const encoder = new TextEncoder();
      const bytes = encoder.encode("lolsome");

      // add the bytes to your node and receive a unique content identifier
      const cid = await fs.addBytes(bytes);

      console.log("Added file:", cid.toString());
      const decoder = new TextDecoder();
      let text = "";

      for await (const chunk of fs.cat(cid)) {
        text += decoder.decode(chunk, {
          stream: true,
        });
      }

      console.log("Added file contents:", text);
    };

    init();
  }, [helia]);

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button type="submit">Upload Your Video</button>
      </form>
      <img src={previewImg}></img>
      <video controls ref={videoRef}></video>
    </div>
  );
};
export default IpfsComponent;
