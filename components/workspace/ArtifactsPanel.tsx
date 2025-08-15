"use client";

import React from "react";
import { FileText, Brain } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ArtifactsPanel() {

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-[15px] font-semibold text-foreground">Artifacts</h2>
        <div className="h-2 w-2 rounded-full bg-green-500" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content & Code
          </h3>
          
          <div className="rounded-xl border border-dashed border-border bg-muted p-4 text-[14px] leading-6 text-muted-foreground">
            Artifacts and code generated during conversations will appear here. This panel provides a clean workspace for viewing and managing generated content.
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Reasoning Summary
            </h3>
            
            <div className="rounded-xl border border-dashed border-border bg-muted p-4 text-[14px] leading-6 text-muted-foreground">
              When GPT-5 reasoning is enabled, key insights and reasoning summaries will be displayed here for reference.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}