"use client";

import React from "react";
import {
  Bot,
  MessageSquare,
  Cpu,
  PanelRight,
  PanelRightOpen,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";

type SidebarProps = {
  onOpenPromptSettings: () => void;
  modelType: 'gpt-5' | 'gpt-5-nano';
  onToggleModel: () => void;
  artifactsPanelOpen: boolean;
  onToggleArtifactsPanel: () => void;
};

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  badge?: string | number;
};

const IconButton = ({ children, label, active, badge, ...props }: IconButtonProps) => {
  return (
    <div className="relative">
      <button
        aria-label={label}
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
          active 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
        {...props}
      >
        {children}
      </button>
      {badge && (
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 h-5 w-auto min-w-5 px-1 text-[10px] font-medium"
        >
          {badge}
        </Badge>
      )}
    </div>
  );
};

export default function Sidebar({
  onOpenPromptSettings,
  modelType,
  onToggleModel,
  artifactsPanelOpen,
  onToggleArtifactsPanel
}: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <aside className="h-full w-16 shrink-0 border-r bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="flex h-full flex-col items-center justify-between py-3">
        <div className="flex flex-col items-center gap-3">
          {/* Theme Toggle */}
          <div className="mb-1 mt-1">
            <IconButton
              label="Toggle theme"
              onClick={toggleTheme}
              title="Toggle light/dark"
            >
              <Bot size={20} />
            </IconButton>
          </div>
          
          <div className="h-px w-8 bg-border my-1" />
          
          {/* Custom Prompt Settings */}
          <IconButton 
            label="Prompt Settings" 
            onClick={onOpenPromptSettings}
            title="Configure system prompt"
          >
            <MessageSquare size={18} />
          </IconButton>
          
          {/* Model Switcher */}
          <IconButton 
            label={`Switch to ${modelType === 'gpt-5' ? 'nano' : 'full'}`}
            onClick={onToggleModel}
            active={modelType === 'gpt-5'}
            title={`Current: ${modelType}. Click to switch.`}
          >
            {modelType === 'gpt-5' ? <Cpu size={18} /> : <Zap size={18} />}
          </IconButton>
          
          {/* Artifacts Panel Toggle */}
          <IconButton 
            label="Toggle Artifacts Panel" 
            onClick={onToggleArtifactsPanel}
            active={artifactsPanelOpen}
            title="Show/hide artifacts panel"
          >
            {artifactsPanelOpen ? <PanelRight size={18} /> : <PanelRightOpen size={18} />}
          </IconButton>
        </div>

        {/* User Avatar */}
        <button
          aria-label="User"
          className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-foreground"
        >
          <span className="text-sm font-medium">J</span>
        </button>
      </div>
    </aside>
  );
}