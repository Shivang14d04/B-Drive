"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../components/ui/navigation-menu";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

export const Header = () => {
  const pathname = usePathname();
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.classList.add("hidden");
  });

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Left Section — Your Logo */}
        <Link href="/" className="flex items-center ">
          <div className="relative w-40 h-10">
            {/* Replace the logo file name here */}
            <Image src="/LOGO.png" alt="B-Drive Logo" fill className="rounded-full object-cover" />
          </div>
        </Link>

        {/* Center — Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map(({ name, href }) => (
              <NavigationMenuItem key={name}>
                <NavigationMenuLink
                  asChild
                  className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                    pathname === href ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Link href={href}>{name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right — Wallet, Avatar */}
        <div className="flex items-center gap-3">
          <RainbowKitCustomConnectButton />
          <Avatar>
            <AvatarImage src="/default-avatar.png" alt="User" />
            <AvatarFallback>BD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
