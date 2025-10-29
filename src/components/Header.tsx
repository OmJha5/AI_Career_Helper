import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, Pen, PenBox, StarsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

export default function Header() {
  return (
    <header className="sticky top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">

        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/">
                <Image 
                    src="/logo.png"
                    alt="Sensai Logo"
                    width={200}
                    height={60}
                    className="h-12 py-1 w-auto object-contain"
                />
            
            </Link>

            <div className="flex items-center space-x-2 md:space-x-4">
                <SignedIn>
                    <Link href="/dashboard">
                        <Button variant="outline">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="hidden md:block">Industry Insights</span>
                        </Button>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <StarsIcon className="h-4 w-4" />
                                <span className="hidden md:block">Growth Tools</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="py-1 px-1">
                                <Link href="/resume" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden md:block">Build Resume</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="py-1 px-1">
                                <Link href="/ai-cover-letter" className="flex items-center gap-2">
                                    <PenBox className="h-4 w-4" />
                                    <span className="hidden md:block">Cover Letter</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="py-1 px-1">
                                <Link href="/interview" className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    <span className="hidden md:block">Interview Prep</span>
                                </Link>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <SignInButton >
                        <Button variant="outline">Sign In</Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </nav>

    </header>
  );
}
