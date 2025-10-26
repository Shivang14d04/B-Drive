"use client";

import React from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HeartIcon } from "@heroicons/react/24/outline";

export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-4 mb-11 lg:mb-0">
      <div className="w-full flex justify-center items-center relative">
        {/* Centered main content */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <div className="text-center">
            <a href="https://github.com/shivang14d04/" target="_blank" rel="noreferrer" className="link">
              Fork me
            </a>
          </div>
          <span>·</span>
          <div className="flex items-center gap-2">
            <p className="m-0 text-center">
              Built with <HeartIcon className="inline-block h-4 w-4 text-red-500" /> by
            </p>
            <a
              href="https://github.com/shivang14d04/"
              target="_blank"
              rel="noreferrer"
              className="link ml-1 font-semibold"
            >
              Shivang
            </a>
          </div>
        </div>

        {/* Right-aligned Connect button */}
        <div className="absolute right-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:scale-105 transition-transform">
                Connect with me
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <a href="https://github.com/shivang14d04/" target="_blank" rel="noreferrer">
                  <FaGithub className="mr-2 text-gray-700" /> GitHub
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://x.com/Shivang141204" target="_blank" rel="noreferrer">
                  <FaTwitter className="mr-2 text-blue-500" /> X
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.instagram.com/shivang14h08/" target="_blank" rel="noreferrer">
                  <FaInstagram className="mr-2 text-pink-500" /> Instagram
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.linkedin.com/in/shivang-kumar-64aa6428b/" target="_blank" rel="noreferrer">
                  <FaLinkedin className="mr-2 text-blue-700" /> LinkedIn
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
