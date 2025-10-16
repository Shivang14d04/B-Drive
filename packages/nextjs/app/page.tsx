"use client";

import { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function DrivePage() {
  const { address } = useAccount();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { writeContractAsync } = useScaffoldWriteContract("Bdrive");

  const { data: userFiles, refetch } = useScaffoldReadContract({
    contractName: "Bdrive",
    functionName: "getAllFilesOfaUser",
    args: [address],
  });

  // 🔥 Upload to Lighthouse
  const handleUploadToLighthouse = async () => {
    if (!fileName || !file) return alert("Enter file name and choose a file");

    setUploading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY as string;
      const output = await lighthouse.upload(file, apiKey);
      const cid = output.data.Hash;
      console.log("📦 Uploaded to IPFS:", cid);

      // Call smart contract
      await writeContractAsync({
        functionName: "uploadFile",
        args: [fileName, cid],
      });

      alert("✅ File uploaded successfully!");
      setFileName("");
      setFile(null);
      refetch();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">🗂️ Decentralized Drive</h1>

      {/* Upload Section */}
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl mb-4">Upload File</h2>
        <input
          type="text"
          placeholder="File name"
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800"
        />
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 mb-3 rounded bg-gray-800"
        />
        <button
          onClick={handleUploadToLighthouse}
          disabled={uploading}
          className={`w-full px-4 py-2 rounded ${uploading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"}`}
        >
          {uploading ? "Uploading..." : "Upload to IPFS"}
        </button>
      </div>

      {/* File List */}
      <h2 className="text-2xl mt-10 mb-4">Your Files</h2>
      <div className="space-y-3">
        {userFiles?.map((file: any, idx: number) => (
          <div key={idx} className="bg-gray-800 p-3 rounded w-80">
            <p className="font-semibold">{file.name}</p>
            <p className="text-gray-400 text-sm">{new Date(Number(file.timestamp) * 1000).toLocaleString()}</p>
            <a
              href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View File
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
