import OpenAI from 'openai';

export const OPENAI_CONFIG = {
  apiKey: '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',
  model: 'gpt-5-nano-2025-08-07'
};

export const MODEL_CONFIGS = {
  'gpt-5': 'gpt-5-2025-08-07',
  'gpt-5-nano': 'gpt-5-nano-2025-08-07'
} as const;

export const MODEL_PRICING = {
  'gpt-5': {
    input: 0.00003,   // $3.00 per 1M tokens
    output: 0.00012   // $12.00 per 1M tokens  
  },
  'gpt-5-nano': {
    input: 0.0000001,  // $0.10 per 1M tokens
    output: 0.0000004  // $0.40 per 1M tokens
  }
} as const;

export interface ChatMessage {
  role: 'developer' | 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: { url: string };
  }>;
}

export interface ReasoningOutput {
  id: string;
  type: 'reasoning';
  summary?: Array<{
    type: 'summary_text';
    text: string;
  }>;
}

export interface MessageOutput {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{
    type: 'output_text';
    text: string;
    annotations: any[];
  }>;
}

export interface ChatResponse {
  id: string;
  status: 'completed' | 'incomplete' | 'in_progress';
  output: Array<ReasoningOutput | MessageOutput>;
  output_text: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    output_tokens_details: {
      reasoning_tokens: number;
    };
    total_tokens: number;
  };
  incomplete_details?: {
    reason: string;
  };
}

export interface StreamEvent {
  type: string;
  sequence_number: number;
  [key: string]: any;
}

export interface OutputTextDeltaEvent extends StreamEvent {
  type: 'response.output_text.delta';
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}

export interface ReasoningSummaryTextDeltaEvent extends StreamEvent {
  type: 'response.reasoning_summary_text.delta';
  item_id: string;
  output_index: number;
  summary_index: number;
  delta: string;
}

export interface ReasoningTextDeltaEvent extends StreamEvent {
  type: 'response.reasoning_text.delta';
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}

export interface ResponseCompletedEvent extends StreamEvent {
  type: 'response.completed';
  response: ChatResponse;
}

export class OpenAIClient {
  private client: OpenAI;
  private lastUsedModel: 'gpt-5' | 'gpt-5-nano' = 'gpt-5-nano';

  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_CONFIG.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async generateResponse(
    input: string | ChatMessage[],
    options: {
      instructions?: string;
      effort?: 'low' | 'medium' | 'high';
      showReasoning?: boolean;
      maxTokens?: number;
      stream?: boolean;
      onReasoningDelta?: (text: string) => void;
      modelOverride?: 'gpt-5' | 'gpt-5-nano';
    } = {}
  ): Promise<ChatResponse> {
    const {
      instructions,
      effort = 'medium',
      showReasoning = true,
      maxTokens,
      stream = false,
      onReasoningDelta,
      modelOverride
    } = options;

    try {
      const modelToUse = modelOverride || 'gpt-5-nano';
      this.lastUsedModel = modelToUse;
      
      const requestData: any = {
        model: MODEL_CONFIGS[modelToUse],
        input,
        reasoning: {
          effort,
          ...(showReasoning && { summary: 'auto' })
        },
        stream
      };

      // Only add max_output_tokens if explicitly specified
      if (maxTokens) {
        requestData.max_output_tokens = maxTokens;
      }

      if (instructions) {
        requestData.instructions = instructions;
      }

      if (stream) {
        return this.handleStreamingResponse(requestData, onReasoningDelta);
      }

      const response = await this.client.responses.create(requestData);
      
      // Debug logging
      console.log('🔍 OpenAI Response:', {
        model: response.model || requestData.model,
        status: response.status,
        outputTypes: response.output?.map(o => o.type),
        hasReasoning: response.output?.some(o => o.type === 'reasoning'),
        usage: response.usage
      });
      
      return response as ChatResponse;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private async handleStreamingResponse(
    requestData: any,
    onReasoningDelta?: (text: string) => void
  ): Promise<ChatResponse> {
    const stream = await this.client.responses.create(requestData) as any;
    
    let reasoningText = '';
    let messageText = '';
    let outputItems: Map<string, any> = new Map();
    let finalResponse: ChatResponse | null = null;

    for await (const event of stream) {
      const streamEvent = event as StreamEvent;
      console.log('📡 Stream event:', streamEvent.type);
      
      // Handle regular message text deltas
      if (streamEvent.type === 'response.output_text.delta') {
        const deltaEvent = streamEvent as OutputTextDeltaEvent;
        messageText += deltaEvent.delta || '';
      }
      
      // Handle reasoning summary text deltas  
      if (streamEvent.type === 'response.reasoning_summary_text.delta') {
        const deltaEvent = streamEvent as ReasoningSummaryTextDeltaEvent;
        reasoningText += deltaEvent.delta || '';
        onReasoningDelta?.(reasoningText);
      }
      
      // Handle reasoning text deltas (live reasoning)
      if (streamEvent.type === 'response.reasoning_text.delta') {
        const deltaEvent = streamEvent as ReasoningTextDeltaEvent;
        reasoningText += deltaEvent.delta || '';
        onReasoningDelta?.(reasoningText);
      }
      
      // Track output items
      if (streamEvent.type === 'response.output_item.added') {
        const addedEvent = streamEvent as any;
        outputItems.set(addedEvent.item.id, addedEvent.item);
      }
      
      // Handle completion
      if (streamEvent.type === 'response.completed') {
        const completedEvent = streamEvent as ResponseCompletedEvent;
        finalResponse = completedEvent.response;
        break;
      }
      
      // Handle errors
      if (streamEvent.type === 'error') {
        const errorEvent = streamEvent as any;
        throw new Error(`Stream error: ${errorEvent.message}`);
      }
    }

    if (!finalResponse) {
      throw new Error('Stream ended without completion event');
    }

    return finalResponse;
  }

  async generateChatResponse(
    messages: ChatMessage[],
    systemInstructions?: string,
    options?: {
      effort?: 'low' | 'medium' | 'high';
      showReasoning?: boolean;
      maxTokens?: number;
      stream?: boolean;
      onReasoningDelta?: (text: string) => void;
      modelOverride?: 'gpt-5' | 'gpt-5-nano';
    }
  ): Promise<ChatResponse> {
    return this.generateResponse(messages, {
      instructions: systemInstructions,
      ...options
    });
  }

  async generateSimpleResponse(
    prompt: string,
    systemInstructions?: string,
    options?: {
      effort?: 'low' | 'medium' | 'high';
      showReasoning?: boolean;
      maxTokens?: number;
    }
  ): Promise<ChatResponse> {
    return this.generateResponse(prompt, {
      instructions: systemInstructions,
      ...options
    });
  }

  extractReasoningSummary(response: ChatResponse): string | null {
    const reasoningOutput = response.output.find(
      item => item.type === 'reasoning'
    ) as ReasoningOutput;

    console.log('🧠 Reasoning extraction:', {
      hasReasoningOutput: !!reasoningOutput,
      hasSummary: !!reasoningOutput?.summary,
      summaryLength: reasoningOutput?.summary?.length || 0,
      firstSummaryText: reasoningOutput?.summary?.[0]?.text?.substring(0, 100) + '...'
    });

    if (reasoningOutput?.summary?.[0]?.text) {
      return reasoningOutput.summary[0].text;
    }
    return null;
  }

  extractMessageContent(response: ChatResponse): string {
    const messageOutput = response.output.find(
      item => item.type === 'message'
    ) as MessageOutput;

    if (messageOutput?.content?.[0]?.text) {
      return messageOutput.content[0].text;
    }
    return response.output_text || '';
  }

  getUsageStats(response: ChatResponse) {
    return {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      reasoningTokens: response.usage.output_tokens_details.reasoning_tokens,
      totalTokens: response.usage.total_tokens,
      cost: this.calculateCost(response.usage, this.lastUsedModel)
    };
  }

  private calculateCost(usage: ChatResponse['usage'], model: 'gpt-5' | 'gpt-5-nano'): number {
    const pricing = MODEL_PRICING[model];
    return (usage.input_tokens * pricing.input) + (usage.output_tokens * pricing.output);
  }
}

export const openaiClient = new OpenAI({
  apiKey: OPENAI_CONFIG.apiKey,
  dangerouslyAllowBrowser: true,
});

export const chatClient = new OpenAIClient();