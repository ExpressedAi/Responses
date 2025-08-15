"use client";

import dynamic from 'next/dynamic';

const AgentWorkspace = dynamic(() => import("@/components/workspace/AgentWorkspace"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-lg font-semibold text-foreground">🚀 Highway System</div>
        <div className="text-sm text-muted-foreground">Initializing intelligence layers...</div>
      </div>
    </div>
  )
});

export default function Home() {
  return <AgentWorkspace />;
}