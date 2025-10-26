"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import lighthouse from "@lighthouse-web3/sdk";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Dashboard() {
  const { address } = useAccount();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);

  const { writeContractAsync } = useScaffoldWriteContract("Bdrive");
  const { data: userFiles, refetch } = useScaffoldReadContract({
    contractName: "Bdrive",
    functionName: "getAllFilesOfaUser",
    args: [address],
  });

  useEffect(() => {
    if (userFiles && Array.isArray(userFiles)) setFiles(userFiles);
  }, [userFiles]);

  // Safe progress calculation
  const progressCallback = (progressData: any) => {
    const uploaded = progressData.uploaded ?? 0;
    const total = progressData.total ?? 1; // avoid division by 0
    const percentageDone = Math.min(Math.round((uploaded / total) * 100), 100);
    setUploadProgress(percentageDone);
  };

  const handleUploadToLighthouse = async () => {
    if (!fileName || !file) {
      toast.warning("Please enter a file name and choose a file first!");
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    try {
      const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY as string;

      // Upload to Lighthouse
      const output = await lighthouse.upload([file], apiKey, undefined, progressCallback);
      const cid = output.data.Hash;

      // Call smart contract
      await writeContractAsync({
        functionName: "uploadFile",
        args: [fileName, cid],
      });

      // Fetch updated file list from blockchain
      await refetch();

      toast.success("✅ File uploaded successfully!");
      setFileName("");
      setFile(null);
      setUploadProgress(0);
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async () => {
    if (fileToDelete === null) return;
    try {
      await writeContractAsync({ functionName: "deleteFile", args: [BigInt(fileToDelete)] });
      await refetch();
      toast.success("🗑️ File deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file!");
    } finally {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Upload Section */}
        <Card className="flex-1 bg-card dark:bg-card-dark transition-colors duration-300">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                placeholder="Enter file name"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">Choose File</Label>
              <Input id="fileUpload" type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>

            {uploading && (
              <div className="space-y-2">
                <Label>Uploading: {uploadProgress}%</Label>
                <Progress value={uploadProgress} />
              </div>
            )}

            <Button onClick={handleUploadToLighthouse} disabled={uploading} className="w-full">
              {uploading ? "Uploading..." : "Upload to IPFS"}
            </Button>
          </CardContent>
        </Card>

        {/* Files List Section */}
        <Card className="flex-[2] flex flex-col bg-card dark:bg-card-dark transition-colors duration-300">
          <CardHeader>
            <CardTitle>Your Files</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <div className="space-y-2 mb-4">
              <Label htmlFor="search">Search Files</Label>
              <Input
                id="search"
                placeholder="Search files..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <Separator className="mb-4 dark:border-border-dark" />

            <ScrollArea className="h-[65vh] pr-4">
              {filteredFiles.length === 0 ? (
                <p className="text-muted-foreground dark:text-muted-foreground-dark">No files found.</p>
              ) : (
                <ul className="divide-y divide-border dark:divide-border-dark">
                  {filteredFiles.map((file: any, idx: number) => (
                    <li
                      key={`${file.cid}-${idx}`}
                      className="flex justify-between items-center py-3 px-2 hover:bg-muted/30 dark:hover:bg-muted-dark/30 transition-colors rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{file.name}</span>
                        <span className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                          {new Date(Number(file.timestamp) * 1000).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setFileToDelete(idx);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-background dark:bg-background-dark transition-colors duration-300">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFile}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
