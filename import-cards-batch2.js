const { Index } = require('@upstash/vector');

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
  console.log('🚀 Starting batch 2 card import...');
  
  // Generative AI Interaction Blueprint
  await addCard({
    id: 'card_2025-08-14_ai_interaction',
    cardType: 'workflow',
    title: 'Generative AI Interaction Blueprint',
    summary: 'Structured approach for leveraging generative AI through reflection, task management, memory, and context session management',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T20:00:00Z')
    },
    content: 'A blueprint to consistently leverage generative AI for complex problem-solving through decomposition, iteration, contextualization, and goal orientation. Key components include reflection (critique previous outputs), task management (explicit task lists and roadmaps), memory & context session management (summarizing and injecting relevant information), and emergent thought combination using meta-analysis ratings. Workflow involves defining goals, task breakdown, execution with reflection, context management, and synthesis.',
    entities: ['decomposition', 'iteration', 'contextualization', 'goal orientation', 'reflection', 'task management', 'context session management', 'meta-analysis'],
    tags: ['AI', 'workflow', 'methodology', 'blueprint', 'problem-solving', 'reflection', 'task-management'],
    scores: {
      priority: 0.9,
      contextStrength: 0.85,
      temporalRelevance: 0.8,
      actionability: 0.95,
      novelty: 0.85
    },
    createdAt: '2025-08-04T20:00:00Z'
  });

  // Memory System Explanation
  await addCard({
    id: 'card_2025-08-14_memory_system',
    cardType: 'concept',
    title: 'Memory System Explanation',
    summary: 'Chat application memory system with autonomous agent, multi-agent memory management, STM/LTM, and massive context windows',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T20:30:00Z')
    },
    content: 'Memory system for chat application featuring autonomous agent managing short-term (STM) and long-term (LTM) memory. Includes onboarding process, reflection every 30 seconds, decay functions, and multi-million-token context windows. Uses meta-analysis filters for episodic, semantic, procedural, and API documentation memories. Supports autonomous mode toggle, JSON persistence, context window scaling, and memory decay for efficiency.',
    entities: ['autonomous agent', 'STM', 'LTM', 'meta-analysis filters', 'episodic memory', 'semantic memory', 'procedural memory', 'context windows', 'memory decay'],
    tags: ['memory', 'autonomous', 'agent', 'STM', 'LTM', 'meta-analysis', 'context', 'persistence'],
    scores: {
      priority: 0.95,
      contextStrength: 0.9,
      temporalRelevance: 0.85,
      actionability: 0.9,
      novelty: 0.9
    },
    createdAt: '2025-08-04T20:30:00Z'
  });
  
  // Multiple API Keys for Parallel Processing
  await addCard({
    id: 'card_2025-08-14_parallel_apis',
    cardType: 'concept',
    title: 'Multiple API Keys for Parallel Processing',
    summary: 'Utilize multiple API keys concurrently for parallel processing to increase efficiency, not for rate-limiting rotation',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:20:00Z')
    },
    content: 'If provided with multiple API keys, assume explicitly these are for parallel processing to increase efficiency, NOT for rotating rate-limiting. Always explicitly use provided multiple keys concurrently for parallelization. Never use multiple keys for rotating or round-robin limitations. This principle maximizes throughput and processing speed through concurrent operations.',
    entities: ['multiple API keys', 'parallel processing', 'concurrency', 'efficiency', 'parallelization', 'throughput optimization'],
    tags: ['APIKeys', 'parallelProcessing', 'efficiency', 'concurrency', 'optimization', 'principle'],
    scores: {
      priority: 0.95,
      contextStrength: 0.9,
      temporalRelevance: 0.95,
      actionability: 0.9,
      novelty: 0.7
    },
    createdAt: '2025-08-04T21:20:00Z'
  });

  // Utilize Provided API Keys Immediately
  await addCard({
    id: 'card_2025-08-14_immediate_keys',
    cardType: 'concept',
    title: 'Utilize Provided API Keys Immediately',
    summary: 'Integrate and explicitly use provided API keys without delay to ensure immediate functionality - never defer or neglect',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:20:00Z')
    },
    content: 'When provided API keys, the user expects immediate and explicit usage within the project\'s codebase. Always integrate and explicitly use provided API keys without delay. Never defer or neglect provided API keys. This ensures immediate functionality and demonstrates responsiveness to user-provided resources.',
    entities: ['API keys', 'immediate integration', 'explicit usage', 'codebase integration', 'immediate functionality'],
    tags: ['APIKeys', 'integration', 'immediateUse', 'security', 'functionality', 'principle'],
    scores: {
      priority: 1.0,
      contextStrength: 1.0,
      temporalRelevance: 1.0,
      actionability: 0.95,
      novelty: 0.6
    },
    createdAt: '2025-08-04T21:20:00Z'
  });

  // Dependency Management Vigilance
  await addCard({
    id: 'card_2025-08-14_dependency_vigilance',
    cardType: 'concept',
    title: 'Dependency Management Vigilance',
    summary: 'Explicitly verify dependencies and versions during edits to prevent catastrophic application failures',
    source: {
      kind: 'user',
      timestamp: Date.parse('2025-08-04T21:20:00Z')
    },
    content: 'Dependency issues cause catastrophic application failures. Always explicitly verify dependencies and versions during edits. Never neglect or overlook potential dependency conflicts. This vigilance prevents version conflicts, breaking changes, and ensures application stability.',
    entities: ['dependency verification', 'version management', 'application stability', 'dependency conflicts', 'version conflicts'],
    tags: ['dependencies', 'versionManagement', 'applicationStability', 'vigilance', 'conflictResolution', 'principle'],
    scores: {
      priority: 0.95,
      contextStrength: 0.9,
      temporalRelevance: 0.95,
      actionability: 0.9,
      novelty: 0.6
    },
    createdAt: '2025-08-04T21:20:00Z'
  });
  
  console.log('🎯 Batch 2 import completed!');
}

main().catch(console.error);