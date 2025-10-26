"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center text-center min-h-[80vh] px-6 bg-background dark:bg-background-dark transition-colors duration-300">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-foreground-dark transition-colors duration-300"
      >
        Welcome to <span className="text-primary dark:text-primary-dark">B-Drive</span>
      </motion.h1>

      <p className="max-w-2xl text-muted-foreground dark:text-muted-foreground-dark text-lg mb-8 transition-colors duration-300">
        A decentralized storage platform built on Ethereum — store, share, and access your files securely using IPFS and
        blockchain verification.
      </p>

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
    </main>
  );
}
