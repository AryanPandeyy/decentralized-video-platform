"use client";
import { Helia, createHelia } from "helia";
import React, { useState, useEffect } from "react";
import { webSockets } from "@libp2p/websockets";
import * as Filters from "@libp2p/websockets/filters";
import { unixfs } from "@helia/unixfs";
import { bootstrap } from "@libp2p/bootstrap";
import { createLibp2p } from "libp2p";

const IpfsComponent = () => {
  const [helia, setHelia] = useState<Helia>();
  const [data, setData] = useState();
  const [previewImg, setPreviewImg] = useState();
  const [selectedFile, setSelectedFile] = useState<any>();
  const handleUpload = async (e) => {
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
          content: Buffer(reader.result),
        });
        console.log(cid.toString());
        for await (const chunk of fs.cat(cid)) {
          const image = Buffer.from(chunk).toString("base64");
          setPreviewImg("data:image/png;base64," + image);
        }
      };
      console.log(selectedFile);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const init = async () => {
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

      if (helia) return;

      const heliaNode = await createHelia({ libp2p });
      setHelia(heliaNode);
      console.log(heliaNode.libp2p.peerId);
      const fs = unixfs(heliaNode);
      // we will use this TextEncoder to turn strings into Uint8Arrays
      const encoder = new TextEncoder();
      const bytes = encoder.encode("custom");

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
        <button type="submit">Upload</button>
      </form>
      <img src={previewImg}></img>
    </div>
  );
};
export default IpfsComponent;
