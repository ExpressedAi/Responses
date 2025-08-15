"use client";

import React from "react";
import Sidebar from "./Sidebar";
import ArtifactsPanel from "./ArtifactsPanel";
import MessageBubble, { type Message } from "./Chat/MessageBubble";
import ChatInput from "./Chat/ChatInput";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { mainChatIntelligence } from "@/lib/main-chat-intelligence";
import SettingsPanel from "./SettingsPanel";
import PromptSettingsPage from "./PromptSettingsPage";

export default function AgentWorkspace() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentView, setCurrentView] = React.useState<'chat' | 'prompt-settings'>('chat');
  const [modelType, setModelType] = React.useState<'gpt-5' | 'gpt-5-nano'>('gpt-5-nano');
  const [artifactsPanelOpen, setArtifactsPanelOpen] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);


  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const onSend = async (text: string) => {
    const id = crypto.randomUUID();
    const thinkingId = crypto.randomUUID();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id, role: "user", content: text },
      {
        id: thinkingId,
        role: "assistant",
        thinking: true,
        content: "",
      },
    ]);

    try {
      // Process through main chat intelligence with streaming
      const intelligenceResponse = await mainChatIntelligence.processMessage(text, {
        showReasoning: true,
        stream: true,
        modelOverride: modelType,
        onReasoningDelta: (reasoningText: string) => {
          // Update thinking bubble with live reasoning
          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingId
                ? {
                    id: thinkingId,
                    role: "assistant",
                    thinking: true,
                    content: reasoningText,
                  }
                : m
            )
          );
        }
      });

      // Show reasoning during thinking if available
      if (intelligenceResponse.reasoning) {
        window.setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingId
                ? {
                    id: thinkingId,
                    role: "assistant",
                    thinking: true,
                    content: intelligenceResponse.reasoning || "",
                  }
                : m
            )
          );
        }, 500);
      }

      // Update with final response
      window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? {
                  id: thinkingId,
                  role: "assistant",
                  content: intelligenceResponse.content,
                  metadata: intelligenceResponse.metadata,
                }
              : m
          )
        );
      }, intelligenceResponse.reasoning ? 2500 : 1500);

    } catch (error) {
      console.error("Main Chat Intelligence error:", error);
      
      window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? {
                  id: thinkingId,
                  role: "assistant",
                  content: `❌ **Intelligence System Error**\n\nFailed to process through main chat intelligence:\n\n${error instanceof Error ? error.message : String(error)}\n\nFalling back to basic sentinel network...`,
                }
              : m
          )
        );
      }, 1000);
    }
  };

  // Sidebar control handlers
  const handleOpenPromptSettings = () => {
    setCurrentView('prompt-settings');
  };

  const handleToggleModel = () => {
    setModelType(prev => prev === 'gpt-5' ? 'gpt-5-nano' : 'gpt-5');
  };

  const handleToggleArtifactsPanel = () => {
    setArtifactsPanelOpen(prev => !prev);
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <SettingsPanel />
      <Sidebar 
        onOpenPromptSettings={handleOpenPromptSettings}
        modelType={modelType}
        onToggleModel={handleToggleModel}
        artifactsPanelOpen={artifactsPanelOpen}
        onToggleArtifactsPanel={handleToggleArtifactsPanel}
      />
      <div className="flex min-w-0 flex-1">
        {currentView === 'prompt-settings' && (
          <PromptSettingsPage 
            onBack={handleBackToChat}
            modelType={modelType}
          />
        )}

        {currentView === 'chat' && (
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={artifactsPanelOpen ? 70 : 100} minSize={50} className="min-w-0">
              <div className="flex h-full min-w-0 flex-col">
              <div className="flex items-center gap-2 border-b px-6 py-4">
                <h1 className="text-lg font-semibold text-foreground tracking-tight">
                  Highway
                </h1>
                <span className="text-muted-foreground">/
                </span>
                <span className="text-[13px] text-muted-foreground">
                  your agentic workspace
                </span>
                <div className="ml-auto flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">
                      GPT Responses Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex-1 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6 sm:gap-6">
                    <div className="h-2" />
                    {messages
                      .filter((m) => m.content || m.thinking)
                      .map((m) => (
                        <div key={m.id} className="flex w-full justify-center">
                          <MessageBubble message={m} />
                        </div>
                      ))}
                    <div ref={messagesEndRef} className="h-24" />
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <ChatInput onSend={onSend} />
                </div>
              </div>
            </div>
          </ResizablePanel>

          {artifactsPanelOpen && (
            <>
              <ResizableHandle withHandle className="mx-0" />
              <ResizablePanel defaultSize={35} minSize={30} className="border-l">
                <ArtifactsPanel />
              </ResizablePanel>
            </>
          )}
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
