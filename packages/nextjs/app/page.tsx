"use client";

import { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function DrivePage() {
  const { address } = useAccount();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  const { writeContractAsync } = useScaffoldWriteContract("Bdrive");

  const { data: userFiles, refetch } = useScaffoldReadContract({
    contractName: "Bdrive",
    functionName: "getAllFilesOfaUser",
    args: [address],
  });

  // Sync fetched data to local state
  useEffect(() => {
    if (userFiles && Array.isArray(userFiles)) {
      setFiles(userFiles);
    }
  }, [userFiles]);

  // Upload file to Lighthouse + store metadata on-chain
  const handleUploadToLighthouse = async () => {
    if (!fileName || !file) return alert("Enter file name and choose a file");

    setUploading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY as string;

      // Important: lighthouse.upload expects an array of files
      const output = await lighthouse.upload([file], apiKey);
      const cid = output.data.Hash;
      console.log("📦 Uploaded to IPFS:", cid);

      // Store metadata on blockchain
      await writeContractAsync({
        functionName: "uploadFile",
        args: [fileName, cid],
      });

      alert("✅ File uploaded successfully!");

      // Clear input fields
      setFileName("");
      setFile(null);

      // Update immediately without waiting for refetch
      const newFile = {
        name: fileName,
        cid,
        owner: address,
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
      };
      setFiles(prev => [...prev, newFile]);

      // Trigger on-chain refetch (optional)
      await refetch();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  // Delete file from blockchain
  const handleDeleteFile = async (fileId: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await writeContractAsync({
        functionName: "deleteFile",
        args: [BigInt(fileId)],
      });
      alert("🗑️ File deleted!");

      // Remove locally
      setFiles(prev => prev.filter((_, idx) => idx !== fileId));

      // Refetch from chain
      await refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    }
  };

  // Filter files by name
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">🗂️ Decentralized Drive</h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        {/* Upload Section */}
        <div className="bg-gray-900 p-6 rounded-xl flex-1">
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

        {/* Files List Section */}
        <div className="bg-gray-900 p-6 rounded-xl flex-[2] flex flex-col">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-800"
          />

          <div className="overflow-y-auto flex-1 space-y-3 max-h-[70vh]">
            {filteredFiles.length === 0 ? (
              <p className="text-gray-400">No files found.</p>
            ) : (
              filteredFiles.map((file: any, idx: number) => (
                <div key={`${file.cid}-${idx}`} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-gray-400 text-sm">{new Date(Number(file.timestamp) * 1000).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteFile(idx)}
                      className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
