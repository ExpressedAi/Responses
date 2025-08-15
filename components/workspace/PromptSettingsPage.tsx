"use client";

import React from "react";
import { ArrowLeft, Save, RotateCcw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type PromptSettingsPageProps = {
  onBack: () => void;
  modelType: 'gpt-5' | 'gpt-5-nano';
};

export default function PromptSettingsPage({ 
  onBack, 
  modelType
}: PromptSettingsPageProps) {
  const [customPrompt, setCustomPrompt] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
    // Load saved prompt from localStorage
    const saved = localStorage.getItem('highway-custom-prompt');
    if (saved) {
      setCustomPrompt(saved);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSave = () => {
    localStorage.setItem('highway-custom-prompt', customPrompt);
    // TODO: Trigger prompt reload in main chat intelligence
    onBack();
  };

  const handleReset = () => {
    setCustomPrompt("");
    localStorage.removeItem('highway-custom-prompt');
  };

  const estimatedTokens = customPrompt.length * 0.75; // Rough estimate

  return (
    <div className="h-full w-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Chat
          </Button>
          <h1 className="text-2xl font-semibold">System Prompt & Context</h1>
          <Badge variant={modelType === 'gpt-5' ? 'default' : 'secondary'}>
            {modelType}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-8">

          {/* Custom System Prompt */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Custom System Prompt</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>~{Math.round(estimatedTokens)} tokens</span>
                <Button variant="ghost" size="sm">
                  <Copy size={14} className="mr-1" />
                  Copy Default
                </Button>
              </div>
            </div>
            
            <Textarea
              placeholder="Enter your custom system prompt here. Leave empty to use default Highway system prompt..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            
            {customPrompt && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <strong>Preview:</strong> Your custom prompt will override the default Highway system prompt.
                The model will receive your instructions with the current context settings above.
              </div>
            )}
          </div>

          {/* Model Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Model Information</h2>
            <div className="grid gap-3">
              <div className="p-3 border rounded-lg">
                <strong className="text-sm">GPT-5:</strong>
                <span className="text-sm text-muted-foreground ml-2">
                  Latest reasoning model with maximum capabilities ($3/$12 per 1M tokens)
                </span>
              </div>
              <div className="p-3 border rounded-lg">
                <strong className="text-sm">GPT-5 Nano:</strong>
                <span className="text-sm text-muted-foreground ml-2">
                  Efficient reasoning model with 96% cost reduction ($0.10/$0.40 per 1M tokens)
                </span>
              </div>
              <div className="p-3 border rounded-lg">
                <strong className="text-sm">Reasoning Features:</strong>
                <span className="text-sm text-muted-foreground ml-2">
                  Both models support advanced reasoning with real-time thinking streams
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}