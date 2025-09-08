"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/i18n-provider";
import { Globe } from "lucide-react";

const USFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 7410 3900">
        <path fill="#b22234" d="M0 0h7410v3900H0z"/>
        <path stroke="#fff" stroke-width="300" d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"/>
        <path fill="#3c3b6e" d="M0 0h2964v2100H0z"/>
        <g fill="#fff">
            <g id="s18">
                <g id="s9">
                    <path id="s" d="m148.2 210-45.6-138.9-45.6 138.9h56.8l-145.2-85.8h180.4z"/>
                    <use href="#s" y="420"/>
                    <use href="#s" y="840"/>
                    <use href="#s" y="1260"/>
                </g>
                <use href="#s9" y="210"/>
            </g>
            <use href="#s18" x="247"/>
            <use href="#s18" x="494"/>
            <use href="#s18" x="741"/>
            <use href="#s18" x="988"/>
            <use href="#s18" x="1235"/>
        </g>
    </svg>
)

const ESFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 750 500">
        <path fill="#c60b1e" d="M0 0h750v500H0z"/>
        <path fill="#ffc400" d="M0 125h750v250H0z"/>
    </svg>
)

export default function LanguageSwitcher() {
  const { setLanguage } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")} className="gap-2">
            <USFlag />
            English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("es")} className="gap-2">
            <ESFlag />
            Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
