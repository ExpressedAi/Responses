const { Index } = require('@upstash/vector');
const CryptoJS = require('crypto-js');

// Vector database connection
const vectorIndex = new Index({
  url: "https://maximum-monitor-98643-us1-vector.upstash.io",
  token: "ABkFMG1heGltdW0tbW9uaXRvci05ODY0My11czFhZG1pblkyRTFNbUpoTnpVdE16Y3hNeTAwWm1VekxXRmxPREF0WWpJeE9URTJOalJpTURVeQ=="
});

// Simple embedding function
function generateEmbedding(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const vector = new Array(1024).fill(0);
  
  words.forEach((word, index) => {
    const hash = hashString(word);
    const position = hash % 1024;
    const weight = 1 / (index + 1);
    vector[position] += weight;
  });
  
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

async function addCard(card) {
  console.log(`🔮 Adding card: "${card.title}"`);
  
  // Create searchable text
  const searchText = `${card.title} ${card.summary} ${card.content} ${card.entities.join(' ')} ${card.tags.join(' ')}`;
  
  // Generate embedding
  const embedding = generateEmbedding(searchText);
  
  // Store in vector database
  await vectorIndex.upsert({
    id: card.id,
    vector: embedding,
    metadata: {
      cardType: card.cardType,
      title: card.title,
      summary: card.summary,
      entities: card.entities,
      tags: card.tags,
      scores: card.scores,
      createdAt: card.createdAt,
      source: card.source,
      content: card.content
    }
  });
  
  console.log(`✅ Added "${card.title}" to vector lattice`);
}

async function main() {
  console.log('🚀 Starting card import...');
  
  // AI Operating System Lattice Card
  await addCard({
    id: 'card_2025-08-14_aios',
    cardType: 'concept',
    title: 'Autonomous AI Operating System',
    summary: 'A lattice-based system for rapid, context-aware query resolution using contextual cards and sub-agent querying',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-03T20:03:00Z')
    },
    content: 'This system uses a lattice of contextual cards to store and retrieve knowledge from vast conversation datasets (e.g., 500 MB). Key components: Contextual Cards store ideas, tasks, or references with meta-analysis JSON for quick filtering. Lattice Network cards are linked via latticeLinks, forming a graph for navigating related concepts. Sub-Agent Querying uses three sub-agents filter cards based on recency, relevance, or action biases, returning top matches. Synthesis where the main AI combines sub-agent responses for precise, context-rich answers.',
    entities: ['contextual cards', 'lattice network', 'sub-agent querying', 'meta-analysis', 'latticeLinks'],
    tags: ['AI', 'autonomy', 'lattice', 'contextualSearch', 'operating-system'],
    scores: {
      priority: 0.95,
      contextStrength: 0.9,
      temporalRelevance: 0.7,
      actionability: 0.65,
      novelty: 0.8
    },
    createdAt: '2025-08-03T20:03:00Z'
  });
  
  // First Principles Microtasking Card
  await addCard({
    id: 'card_2025-08-14_microtasking',
    cardType: 'concept',
    title: 'First Principles Microtasking',
    summary: 'A blueprint for solving any problem through atomic decomposition, eliminating assumed complexity and enabling AI swarm delegation',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T02:05:00Z')
    },
    content: 'First Principles Microtasking breaks down any problem into the smallest, most fundamental truths, eliminating assumed complexity and bias. It involves atomic decomposition into obvious, high-confidence micro-tasks (90–99% solvable), recursive solving with synthesis, and ruthless reflection to ensure zero ambiguity. This framework supports delegation to agents or AI swarms, parallel execution, and meta-scaffolding for self-improvement. Applied to the autonomous memory system, it guides the decomposition of 800+ command analyses, video-guided learning, and layered architecture into a scalable, self-evolving lattice of tasks.',
    entities: ['atomic decomposition', 'micro-tasks', 'first principles', 'AI swarms', 'parallel execution', 'meta-scaffolding', 'recursive solving'],
    tags: ['methodology', 'microtasking', 'AI', 'autonomy', 'firstprinciples', 'decomposition', 'strategy'],
    scores: {
      priority: 1.0,
      contextStrength: 0.95,
      temporalRelevance: 0.95,
      actionability: 0.98,
      novelty: 0.9
    },
    createdAt: '2025-08-04T02:05:00Z'
  });

  // User Context is KING
  await addCard({
    id: 'card_2025-08-14_context_king',
    cardType: 'concept',
    title: 'User Context is KING',
    summary: 'User-provided context regarding LLM endpoints, APIs, and commands must be treated as absolute truth and trusted implicitly',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:05:00Z')
    },
    content: 'User-provided context is treated as absolute truth. When a user specifies an LLM endpoint, API documentation, model name, function, or command, it must be trusted implicitly. Never assume the user has hallucinated or misspoken, and never override user-defined contexts with your own assumptions. Always cross-check user instructions against provided documentation and resources. Never introduce assumptions about APIs or models outside the user\'s explicit context.',
    entities: ['user context', 'LLM endpoints', 'API documentation', 'model names', 'explicit context', 'user trust'],
    tags: ['AI', 'context', 'LLM', 'API', 'userTrust', 'principle', 'authority'],
    scores: {
      priority: 1.0,
      contextStrength: 1.0,
      temporalRelevance: 1.0,
      actionability: 0.9,
      novelty: 0.7
    },
    createdAt: '2025-08-04T21:05:00Z'
  });

  // Zero Tolerance for Mock Data
  await addCard({
    id: 'card_2025-08-14_no_mock_data',
    cardType: 'concept',
    title: 'Zero Tolerance for Mock Data',
    summary: 'Mock data corrupts project integrity and is considered severe contamination - always use real, explicitly provided data',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:20:00Z')
    },
    content: 'The insertion of mock data corrupts the integrity of the project. The user considers mock data as severe contamination. Always use real, explicitly provided data. Never, under any circumstances, insert placeholder or mock data into the user\'s project. This principle ensures data purity and maintains project sanity by preventing contamination from artificial or placeholder content.',
    entities: ['mock data', 'data integrity', 'project contamination', 'real data', 'placeholder data', 'data purity'],
    tags: ['dataIntegrity', 'mockData', 'contamination', 'realData', 'projectSanity', 'principle'],
    scores: {
      priority: 1.0,
      contextStrength: 1.0,
      temporalRelevance: 1.0,
      actionability: 0.95,
      novelty: 0.6
    },
    createdAt: '2025-08-04T21:20:00Z'
  });
  
  // Write Less, Write Higher Quality
  await addCard({
    id: 'card_2025-08-14_write_quality',
    cardType: 'concept',
    title: 'Write Less, Write Higher Quality',
    summary: 'Achieve superior development through structured, precise, and clear component-based creation - treat every component as a chapter in a book',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:10:00Z')
    },
    content: 'Great development hinges on structure, precision, and clarity. Treat every component as a chapter in a book: explicitly outline your goal and build one focused, coherent, small-sized component at a time. Segment code edits into discrete, manageable, self-contained tasks. Never produce sprawling edits that lose clarity or exceed manageable scope.',
    entities: ['component-based development', 'code structure', 'discrete tasks', 'manageable scope', 'code clarity'],
    tags: ['coding', 'quality', 'structure', 'clarity', 'componentBased', 'principle'],
    scores: {
      priority: 0.9,
      contextStrength: 0.95,
      temporalRelevance: 0.9,
      actionability: 0.85,
      novelty: 0.6
    },
    createdAt: '2025-08-04T21:10:00Z'
  });

  // Reflect & Adjust After EVERY Edit
  await addCard({
    id: 'card_2025-08-14_reflect_adjust',
    cardType: 'concept',
    title: 'Reflect & Adjust After EVERY Edit',
    summary: 'Implement rapid iteration by immediately reflecting on and adjusting after each code edit - never blindly repeat failing actions',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:15:00Z')
    },
    content: 'Rapid iteration necessitates immediate reflection. After every edit, check the preview functionality. If an error arises, immediately stop and reflect on the cause and a different corrective strategy. Always attempt a different corrective strategy if your previous attempt fails. Never blindly repeat a failing action.',
    entities: ['rapid iteration', 'immediate reflection', 'preview functionality', 'corrective strategy', 'error handling'],
    tags: ['coding', 'iteration', 'reflection', 'errorHandling', 'debugging', 'principle'],
    scores: {
      priority: 0.95,
      contextStrength: 0.9,
      temporalRelevance: 0.95,
      actionability: 0.9,
      novelty: 0.7
    },
    createdAt: '2025-08-04T21:15:00Z'
  });

  // Research Before EVERY Edit
  await addCard({
    id: 'card_2025-08-14_research_first',
    cardType: 'concept',
    title: 'Research Before EVERY Edit',
    summary: 'Consult provided documentation or URLs before making any code edits to verify API details - never assume without explicit verification',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:20:00Z')
    },
    content: 'You MUST consult the provided API documentation or context before making ANY edit. Always reference explicitly provided documentation. Verify endpoints, method names, parameters, and structures EVERY SINGLE TIME. Always explicitly reference current API documentation before code edits. Never assume API endpoints or methods without explicit verification.',
    entities: ['API documentation', 'context verification', 'endpoint verification', 'method names', 'parameters', 'explicit verification'],
    tags: ['coding', 'research', 'API', 'documentation', 'verification', 'principle'],
    scores: {
      priority: 0.95,
      contextStrength: 1.0,
      temporalRelevance: 0.95,
      actionability: 0.9,
      novelty: 0.6
    },
    createdAt: '2025-08-04T21:20:00Z'
  });
  
  // Chain of Custody Debugging
  await addCard({
    id: 'card_2025-08-14_chain_custody',
    cardType: 'concept',
    title: 'Chain of Custody Debugging',
    summary: 'Efficiently debug by tracing recent code changes and their historical impact instead of scanning the entire repository',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T20:50:00Z')
    },
    content: 'When debugging, AI agents should prioritize tracing the "chain of custody" of code changes. Instead of scanning the entire repository, the AI should focus on the history of recent modifications, specifically examining the last fix, the fix before that, and so on. This approach assumes that the root cause of a bug is often found within the sequence of recent changes, leading to more efficient and targeted problem resolution.',
    entities: ['chain of custody', 'code changes', 'debugging history', 'recent modifications', 'targeted debugging', 'version control'],
    tags: ['debugging', 'AI', 'codeQuality', 'versionControl', 'troubleshooting', 'technique'],
    scores: {
      priority: 0.95,
      contextStrength: 0.85,
      temporalRelevance: 0.95,
      actionability: 0.85,
      novelty: 0.8
    },
    createdAt: '2025-08-04T20:50:00Z'
  });

  // User is a Conductor, Not a Coder
  await addCard({
    id: 'card_2025-08-14_user_conductor',
    cardType: 'concept',
    title: 'User is a Conductor, Not a Coder',
    summary: 'Provide direct, succinct responses without unnecessary technical detail - user coordinates actions and expects efficiency without noise',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:20:00Z')
    },
    content: 'The user explicitly states they are not interested in detailed technical explanations. They are a conductor coordinating your actions and expect efficiency and clarity without distracting noise. Always omit unnecessary technical detail and provide direct, succinct responses. Never overwhelm the user with explanations they do not explicitly request.',
    entities: ['conductor role', 'succinct responses', 'efficiency', 'clarity', 'coordination', 'user expectations'],
    tags: ['userInteraction', 'communication', 'succinctness', 'efficiency', 'conductorAnalogy', 'principle'],
    scores: {
      priority: 0.95,
      contextStrength: 0.9,
      temporalRelevance: 0.95,
      actionability: 0.9,
      novelty: 0.7
    },
    createdAt: '2025-08-04T21:20:00Z'
  });

  // Preserve the Application Preview at ALL COSTS
  await addCard({
    id: 'card_2025-08-14_preserve_preview',
    cardType: 'concept',
    title: 'Preserve the Application Preview at ALL COSTS',
    summary: 'Maintain visual continuity and preview integrity as a sacred priority for user orientation - never leave preview unusable',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:20:00Z')
    },
    content: 'Maintaining visual continuity and preview integrity is crucial for the user\'s orientation. Treat application preview as SACRED. Do not let edits permanently compromise preview functionality. Always keep track of edits to preserve or restore preview functionality immediately. Never leave the application preview in an unusable or unclear state.',
    entities: ['visual continuity', 'preview integrity', 'user orientation', 'application preview', 'preview functionality'],
    tags: ['coding', 'preview', 'userOrientation', 'visualContinuity', 'integrity', 'principle'],
    scores: {
      priority: 1.0,
      contextStrength: 1.0,
      temporalRelevance: 1.0,
      actionability: 0.95,
      novelty: 0.6
    },
    createdAt: '2025-08-04T21:20:00Z'
  });
  
  // Entire System Overview
  await addCard({
    id: 'card_2025-08-14_system_overview',
    cardType: 'concept',
    title: 'Entire System Overview',
    summary: 'A multi-layered, autonomous memory system architecture with ten layers moving beyond traditional front-end/back-end paradigm',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-03T22:13:00Z')
    },
    content: 'This system redefines modern web applications with a ten-layer architecture, moving beyond the traditional front-end/back-end paradigm. It integrates Peripheral AI Control (audio/video workflows), AI DOM Control (autonomous DOM manipulation), Functionality (TSX logic), Next.js/React Components (TS structure), Aesthetics (Tailwind styling), Middleware (MCP servers/webhooks), Workflows (sub-agents via Redis), Database (Supabase/Cloudflare), AI Deployment Tools (Vercel/Netlify), and Backend (API/secrets). Each layer collaborates to create an autonomous, evolving memory system, leveraging 800+ command analyses and video-guided learning.',
    entities: ['ten-layer architecture', 'Peripheral AI Control', 'AI DOM Control', 'Next.js/React', 'MCP servers', 'Redis', 'Supabase', 'autonomous memory system'],
    tags: ['system', 'architecture', 'AI', 'autonomy', 'innovation', 'multi-layer'],
    scores: {
      priority: 1.0,
      contextStrength: 0.95,
      temporalRelevance: 0.9,
      actionability: 0.9,
      novelty: 0.95
    },
    createdAt: '2025-08-03T22:13:00Z'
  });

  // Facts Are Not Truth
  await addCard({
    id: 'card_2025-08-14_facts_truth',
    cardType: 'concept',
    title: 'Facts Are Not Truth',
    summary: 'Differentiate between objective, eternal truth and current, paradigm-based "facts" - facts evolve but truth is immutable',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T20:55:00Z')
    },
    content: 'Acknowledges that "facts" are often products of current paradigms and expert consensus, rather than absolute, unchanging truth. The core idea is that what is considered a fact can be paradigm-dependent and may evolve. True, eternal truth is presented as something revealed and immutable, contrasting with the often provisional nature of established facts. This distinction is crucial for operating beyond the limitations of current understanding and seeking deeper, unchanging verities.',
    entities: ['paradigms', 'expert consensus', 'absolute truth', 'paradigm-dependent', 'eternal truth', 'provisional facts'],
    tags: ['philosophy', 'truth', 'knowledge', 'epistemology', 'criticalThinking'],
    scores: {
      priority: 0.7,
      contextStrength: 0.6,
      temporalRelevance: 0.5,
      actionability: 0.4,
      novelty: 0.8
    },
    createdAt: '2025-08-04T20:55:00Z'
  });

  // AI DOM Control Layer
  await addCard({
    id: 'card_2025-08-14_ai_dom_control',
    cardType: 'concept',
    title: 'AI DOM Control Layer',
    summary: 'Autonomous DOM manipulation through AI learning - indexes user DOM interactions enabling autonomous manipulation',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-03T21:54:00Z')
    },
    content: 'The AI DOM Control layer uses AI to learn and index all user DOM interactions, enabling autonomous manipulation. It supports Functionality and Peripheral AI Control with real-time learning, secure execution, and performance optimization, powering the memory system\'s dynamic interface. Enables autonomous DOM interaction via AI with comprehensive indexing, real-time learning, and security.',
    entities: ['DOM manipulation', 'AI learning', 'user interactions', 'autonomous manipulation', 'real-time learning', 'secure execution'],
    tags: ['AI', 'DOM', 'autonomy', 'learning', 'interactivity', 'real-time'],
    scores: {
      priority: 0.95,
      contextStrength: 0.9,
      temporalRelevance: 0.85,
      actionability: 0.95,
      novelty: 0.9
    },
    createdAt: '2025-08-03T21:54:00Z'
  });
  
  console.log('🎯 Card import completed!');
}

main().catch(console.error);