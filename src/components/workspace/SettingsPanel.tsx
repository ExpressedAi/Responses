"use client";

import React from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [customPrompt, setCustomPrompt] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('highway-custom-prompt') || '';
    }
    return '';
  });

  const savePrompt = () => {
    localStorage.setItem('highway-custom-prompt', customPrompt);
    // Trigger reload of chat intelligence
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
      >
        <Settings className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 bg-card border rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">System Prompt</h3>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">×</button>
      </div>
      
      <textarea
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder="Enter custom system prompt to override default..."
        className="w-full h-40 p-3 border rounded-md resize-none text-sm"
      />
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={savePrompt}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save & Reload
        </button>
        <button
          onClick={() => {
            setCustomPrompt('');
            localStorage.removeItem('highway-custom-prompt');
            window.location.reload();
          }}
          className="px-3 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}