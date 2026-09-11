"use client";

import { useState } from "react";
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
  const router = useRouter();

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
      className="inline-flex items-center gap-2.5 bg-white dark:bg-card/95 border border-border/80 rounded-full p-2 pl-4 shadow-xl shadow-black/5 hover:shadow-2xl hover:border-primary/50 transition-all max-w-md w-full backdrop-blur-md"
    >
      <div className="flex items-center gap-1.5 text-primary font-bold text-xs shrink-0 pr-3 border-r border-border/60">
        <GraduationCap className="h-4 w-4" />
        <span className="truncate max-w-[120px]">{orgName}</span>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "ค้นหาหลักสูตร, บุคลากร, ข่าวสาร..."}
        className="bg-transparent border-0 outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 flex-1 min-w-0"
      />
      <button
        type="submit"
        className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shrink-0 shadow-md shadow-primary/25 transition-transform active:scale-95"
        aria-label="Search"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
