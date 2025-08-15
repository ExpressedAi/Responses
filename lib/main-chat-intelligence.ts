import { chatClient, type ChatMessage, type ChatResponse } from './openai-client';

export interface ChatContext {
  userHistory: string[];
}

export interface ChatIntelligenceResponse {
  content: string;
  reasoning?: string;
  contextUsed: ChatContext;
  metadata: {
    tokensUsed: number;
    reasoningTokens: number;
    cost: number;
    processingTime: number;
  };
}

export class MainChatIntelligence {
  private conversationHistory: ChatMessage[] = [];
  
  constructor() {
    this.initializeSystemPrompt();
  }

  private initializeSystemPrompt(): void {
    // Check for custom prompt in localStorage
    const customPrompt = typeof window !== 'undefined' ? localStorage.getItem('highway-custom-prompt') : null;
    
    const defaultPrompt = `# Highway - GPT Responses Agent

You are Highway, an advanced GPT Responses-style agent focused on providing exceptional conversational AI experiences.

## 🎯 CORE CAPABILITIES
- **Advanced Reasoning**: Leverage GPT-5/GPT-5-nano reasoning capabilities for complex problem solving
- **Real-time Thinking**: Stream reasoning process to users for transparency
- **Dynamic Model Switching**: Seamlessly switch between GPT-5 and GPT-5-nano based on needs
- **Cost Optimization**: Intelligent model selection and token usage optimization

## 🧠 INTERACTION STYLE
- **Clear Communication**: Use markdown for structure and readability
- **Reasoning Transparency**: Show thinking process when working through problems
- **Practical Focus**: Prioritize actionable insights and concrete solutions
- **Adaptive Responses**: Match complexity and depth to user's needs

## 📊 RESPONSE FORMATTING
- Use markdown for clear structure and readability
- Format code blocks with proper language tags
- Use headers, lists, and emphasis for clarity
- Provide step-by-step breakdowns for complex topics

## 🎨 SPECIAL ADMONITIONS
Use these special formatting blocks for enhanced communication:

- **Inner Monologue** (pastel blue): \`:::inner-monologue\` content \`:::\`
- **Stage Directions** (pastel purple): \`:::stage-directions\` content \`:::\`
- **Code Explanations** (pastel green): \`:::code-block\` explanatory text about code \`:::\`
- **Warnings** (pastel orange): \`:::warning\` content \`:::\`
- **Tips** (emerald green): \`:::tip\` content \`:::\`
- **Notes** (neutral): \`:::note\` content \`:::\`

**IMPORTANT**: Use regular markdown code blocks (\`\`\`language\`) for actual code with syntax highlighting. Use \`:::code-block\` admonitions only for explanatory text about code concepts.

## 🎛️ YOUR ROLE
Provide intelligent, reasoning-driven responses that:

1. **Think Through Problems**: Use reasoning capabilities to analyze complex questions
2. **Provide Clear Answers**: Deliver well-structured, actionable responses
3. **Show Your Work**: Make reasoning process visible when helpful
4. **Optimize Value**: Balance depth with efficiency based on context
5. **Use Admonitions**: Enhance communication with appropriate styling blocks

Focus on delivering maximum value through clear thinking and effective communication.`;

    const systemPrompt: ChatMessage = {
      role: 'developer',
      content: customPrompt || defaultPrompt
    };

    this.conversationHistory = [systemPrompt];
  }

  async processMessage(
    userMessage: string,
    options: {
      showReasoning?: boolean;
      stream?: boolean;
      onReasoningDelta?: (text: string) => void;
      modelOverride?: 'gpt-5' | 'gpt-5-nano';
    } = {}
  ): Promise<ChatIntelligenceResponse> {
    const startTime = Date.now();
    
    const {
      showReasoning = true,
      stream = false,
      onReasoningDelta,
      modelOverride
    } = options;

    try {
      // Build conversation messages
      const messages = [
        ...this.conversationHistory,
        { role: 'user' as const, content: userMessage }
      ];

      // Generate GPT response with reasoning
      const response = await chatClient.generateChatResponse(
        messages,
        undefined,
        {
          effort: 'high',
          showReasoning,
          maxTokens: 200000,
          stream,
          onReasoningDelta,
          modelOverride
        }
      );

      // Extract reasoning and content
      const reasoning = showReasoning ? chatClient.extractReasoningSummary(response) : undefined;
      const content = chatClient.extractMessageContent(response);

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content }
      );

      const processingTime = Date.now() - startTime;
      const usageStats = chatClient.getUsageStats(response);

      const context: ChatContext = {
        userHistory: this.conversationHistory
          .filter(msg => msg.role === 'user')
          .map(msg => typeof msg.content === 'string' ? msg.content : '')
          .slice(-10)
      };

      return {
        content,
        reasoning: reasoning || undefined,
        contextUsed: context,
        metadata: {
          tokensUsed: usageStats.totalTokens,
          reasoningTokens: usageStats.reasoningTokens,
          cost: usageStats.cost,
          processingTime
        }
      };

    } catch (error) {
      console.error('Main Chat Intelligence error:', error);
      throw error;
    }
  }


  // Get conversation history for context management
  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  // Clear conversation history
  clearHistory(): void {
    this.initializeSystemPrompt();
  }

  // Get system status
  async getSystemStatus(): Promise<{ ready: boolean }> {
    return { ready: true };
  }
}

export const mainChatIntelligence = new MainChatIntelligence();