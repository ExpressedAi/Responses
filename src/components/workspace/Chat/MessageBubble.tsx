"use client";

import React from "react";
import { Target, DollarSign, Zap, Brain } from "lucide-react";
import ThinkingBubble from "./ThinkingBubble";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: boolean;
  reasoning?: string;
  metadata?: {
    tokensUsed?: number;
    reasoningTokens?: number;
    cost?: number;
    processingTime?: number;
  };
};

export default function MessageBubble({ message }: { message: Message }) {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [showReasoning, setShowReasoning] = React.useState(false);
  
  // Handle smooth transition from thinking to final message
  React.useEffect(() => {
    if (message.thinking) {
      setIsTransitioning(false);
    } else if (!message.thinking && message.content) {
      setIsTransitioning(true);
      // Small delay to show the transition effect
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [message.thinking, message.content]);

  if (message.thinking) {
    return (
      <div className="animate-in fade-in duration-300">
        <ThinkingBubble>{message.content}</ThinkingBubble>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div
      className={[
        "w-full max-w-3xl rounded-2xl border bg-card p-4 sm:p-5 shadow-sm transition-all duration-300",
        isUser ? "border-border" : "border-border",
        isTransitioning ? "animate-in slide-in-from-top-2 fade-in" : "",
      ].join(" ")}
    >
      {/* Main Content */}
      <div className="text-[15px] leading-7">
        {isUser ? (
          <div className="whitespace-pre-wrap text-foreground">
            {message.content}
          </div>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>

      {/* Assistant Features */}
      {!isUser && (
        <div className="mt-4 space-y-3">
          {/* Reasoning Toggle */}
          {message.reasoning && (
            <div className="border-t pt-3">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Brain className="h-3 w-3" />
                {showReasoning ? 'Hide' : 'Show'} Reasoning Process
                <span className="text-[10px]">({message.metadata?.reasoningTokens || 0} tokens)</span>
              </button>
              
              {showReasoning && (
                <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">GPT-5 Chain of Thought:</div>
                  <div className="text-[13px] leading-6 text-muted-foreground whitespace-pre-wrap">
                    {message.reasoning}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          {message.metadata && (
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              {message.metadata.tokensUsed && (
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {message.metadata.tokensUsed.toLocaleString()} tokens
                </span>
              )}
              {message.metadata.cost && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${message.metadata.cost.toFixed(4)}
                </span>
              )}
              {message.metadata.processingTime && (
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {(message.metadata.processingTime / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}