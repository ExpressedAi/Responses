"use client";

import React from "react";
import { Copy, Heart, Settings, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ShortcutSuggestion = {
  id: string;
  text: string;
  description: string;
  confidence: number;
  category: 'code' | 'command' | 'text' | 'secret';
  isSecret?: boolean;
};

export type ShortcutPanelProps = {
  suggestions: ShortcutSuggestion[];
  onCopy: (suggestion: ShortcutSuggestion) => void;
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
};

export default function ShortcutPanel({ 
  suggestions, 
  onCopy, 
  isActive, 
  onToggleActive 
}: ShortcutPanelProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showSecrets, setShowSecrets] = React.useState(false);

  const handleCopy = async (suggestion: ShortcutSuggestion) => {
    try {
      await navigator.clipboard.writeText(suggestion.text);
      setCopiedId(suggestion.id);
      onCopy(suggestion);
      
      // Clear copied state after 2 seconds
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'code': return '💻';
      case 'command': return '⚡';
      case 'text': return '📝';
      case 'secret': return '🔐';
      default: return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'code': return 'text-blue-600 dark:text-blue-400';
      case 'command': return 'text-yellow-600 dark:text-yellow-400';
      case 'text': return 'text-green-600 dark:text-green-400';
      case 'secret': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const filteredSuggestions = suggestions?.filter(s => 
    !s.isSecret || showSecrets
  ) || [];

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            ⚡ AI Shortcuts
            <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowSecrets(!showSecrets)}
              title={showSecrets ? "Hide secrets" : "Show secrets"}
            >
              {showSecrets ? <EyeOff size={12} /> : <Eye size={12} />}
            </Button>
            <Button
              variant="ghost"
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => onToggleActive(!isActive)}
              title="Toggle AI shortcuts"
            >
              <Settings size={12} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-2 overflow-y-auto">
        {!isActive ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-muted-foreground text-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleActive(true)}
                className="mb-2"
              >
                Activate AI Shortcuts
              </Button>
              <p className="text-xs">
                AI will predict what you need to copy based on your current context
              </p>
            </div>
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-muted-foreground text-sm">
              <div className="animate-pulse mb-2">🤖</div>
              <p>AI analyzing context...</p>
              <p className="text-xs mt-1">Shortcut suggestions will appear here</p>
            </div>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="group border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => handleCopy(suggestion)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">
                      {getCategoryIcon(suggestion.category)}
                    </span>
                    <span className={`text-xs font-medium ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category.toUpperCase()}
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all"
                        style={{ width: `${suggestion.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {suggestion.description}
                  </p>
                  <div className="font-mono text-xs bg-muted/50 rounded p-2 break-all">
                    {suggestion.isSecret ? (
                      showSecrets ? suggestion.text : '••••••••••••'
                    ) : (
                      suggestion.text.length > 60 
                        ? suggestion.text.substring(0, 60) + '...' 
                        : suggestion.text
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedId === suggestion.id ? (
                    <Heart size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
        
        {isActive && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              🧠 Learning from your choices • {filteredSuggestions.length} suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}