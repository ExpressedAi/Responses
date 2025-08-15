"use client";

import React from "react";
import { Globe, Mic, Send } from "lucide-react";

export default function ChatInput({
  onSend,
  placeholder = "How can the agent help?",
}: {
  onSend: (text: string) => void;
  placeholder?: string;
}) {
  const [text, setText] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    onSend(v);
    setText("");
  };

  return (
    <div className="sticky bottom-0 z-10 bg-gradient-to-t from-background via-background/90 to-transparent px-4 pb-6 pt-4">
      <form
        onSubmit={submit}
        className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-sm"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button
          type="button"
          aria-label="Language"
          className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Globe className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Voice"
          className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Mic className="h-5 w-5" />
        </button>
        <button
          type="submit"
          aria-label="Send"
          className="rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}