"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight } from "lucide-react";

export function HeroSearchBar({
  orgName,
  placeholder,
}: {
  orgName: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const suggestions = [
    "ค้นหาหลักสูตรปริญญาตรี - โท...",
    "ค้นหาทำเนียบคณาจารย์...",
    "ค้นหาบริการคำร้องออนไลน์...",
    "ค้นหาข่าวสารและประกาศ...",
  ];

  useEffect(() => {
    if (query) return;

    const currentWord = suggestions[placeholderIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
        if (displayText.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % suggestions.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, placeholderIndex, query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/portal/personnel?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/portal/curriculum");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="inline-flex items-center gap-2.5 bg-white dark:bg-card/95 border border-slate-200/90 dark:border-border/80 rounded-full p-2 pl-4 sm:pl-5 shadow-xl shadow-black/5 hover:shadow-2xl hover:border-primary/50 transition-all max-w-lg w-full backdrop-blur-md group"
    >
      <div className="flex items-center gap-2 text-primary font-bold text-xs shrink-0 pr-3 border-r border-border/60">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <GraduationCap className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="truncate max-w-[110px] sm:max-w-[140px] text-slate-800 dark:text-slate-200 font-semibold">{orgName}</span>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={query ? "" : (displayText || placeholder || "ค้นหาข้อมูลในระบบ...")}
        className="bg-transparent border-0 outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 flex-1 min-w-0"
      />
      <button
        type="submit"
        className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 group-hover:shadow-primary/40"
        aria-label="Search"
      >
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
