"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export default function ThinkingBubble({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = typeof children === 'string' ? children : String(children);
  
  return (
    <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/0 p-4 sm:p-5 animate-pulse">
      <div className="pointer-events-none absolute inset-1 rounded-xl border border-dashed border-muted animate-pulse" />
      <div className="mb-3 flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <span>GPT-5 Reasoning...</span>
        <div className="ml-auto flex gap-1">
          <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" />
          <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
      </div>
      <div className="text-[15px] leading-7">
        {content.trim() ? (
          <MarkdownRenderer content={content} className="opacity-80" />
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="animate-pulse">Analyzing your request...</span>
          </div>
        )}
      </div>
    </div>
  );
}