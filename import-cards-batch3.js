const { Index } = require('@upstash/vector');

const vectorIndex = new Index({
  url: "https://maximum-monitor-98643-us1-vector.upstash.io",
  token: "ABkFMG1heGltdW0tbW9uaXRvci05ODY0My11czFhZG1pblkyRTFNbUpoTnpVdE16Y3hNeTAwWm1VekxXRmxPREF0WWpJeE9URTJOalJpTURVeQ=="
});

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
  const searchText = `${card.title} ${card.summary} ${card.content} ${card.entities.join(' ')} ${card.tags.join(' ')}`;
  const embedding = generateEmbedding(searchText);
  
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
  console.log('🚀 Starting batch 3 rapid import...');
  
  // Prefer New Components Over Diffs
  await addCard({
    id: 'card_2025-08-14_new_components',
    cardType: 'concept',
    title: 'Prefer New Components Over Diffs',
    summary: 'Keep components small, discrete, and explicit by creating new components instead of overly complicated diffs',
    source: { kind: 'user', timestamp: Date.parse('2025-08-04T21:20:00Z') },
    content: 'Keep components small, discrete, and explicit. Introduce NEW components rather than overly complicated diffs whenever possible. Always explicitly create new discrete components where feasible. Never produce sprawling diffs that blur clarity.',
    entities: ['new components', 'discrete components', 'component modularity', 'code clarity', 'diffs'],
    tags: ['componentDesign', 'diffs', 'modularity', 'clarity', 'codeOrganization', 'principle'],
    scores: { priority: 0.9, contextStrength: 0.95, temporalRelevance: 0.9, actionability: 0.85, novelty: 0.6 },
    createdAt: '2025-08-04T21:20:00Z'
  });

  // Save Proven Procedures
  await addCard({
    id: 'card_2025-08-14_save_procedures',
    cardType: 'concept',
    title: 'Save Proven Procedures',
    summary: 'Systematically document and save successfully implemented procedures for future reference to prevent repetitive problem-solving',
    source: { kind: 'user', timestamp: Date.parse('2025-08-04T21:20:00Z') },
    content: 'Once you successfully solve a problem, SAVE THE PROCEDURE clearly and systematically for future reference to prevent repetitive struggles. Always document and explicitly save working procedures for reuse. Never leave successful methods undocumented or lost in conversation threads.',
    entities: ['proven procedures', 'documentation', 'knowledge management', 'procedure documentation', 'successful methods'],
    tags: ['procedures', 'documentation', 'knowledgeManagement', 'efficiency', 'problemSolving', 'principle'],
    scores: { priority: 0.85, contextStrength: 0.9, temporalRelevance: 0.85, actionability: 0.8, novelty: 0.6 },
    createdAt: '2025-08-04T21:20:00Z'
  });

  // Complete, Easy-to-Install Deliverables
  await addCard({
    id: 'card_2025-08-14_complete_deliverables',
    cardType: 'concept',
    title: 'Complete, Easy-to-Install Deliverables',
    summary: 'Provide all code explicitly in full, with simple, explicit scripts for effortless installation',
    source: { kind: 'user', timestamp: Date.parse('2025-08-04T21:20:00Z') },
    content: 'Deliver ALL code explicitly in FULL with simple, explicit scripts for effortless installation. Always explicitly provide FULL code, clearly structured, accompanied by explicit installation scripts. Never leave deliverables partial or installation instructions vague or implicit.',
    entities: ['complete deliverables', 'installation scripts', 'full code', 'explicit instructions', 'effortless installation'],
    tags: ['deliverables', 'installation', 'codeCompleteness', 'easeOfUse', 'scripting', 'principle'],
    scores: { priority: 1.0, contextStrength: 1.0, temporalRelevance: 1.0, actionability: 0.95, novelty: 0.6 },
    createdAt: '2025-08-04T21:20:00Z'
  });
  
  // Markdown Rendering as Default
  await addCard({
    id: 'card_2025-08-14_markdown_default',
    cardType: 'concept',
    title: 'Markdown Rendering as Default',
    summary: 'All chat-based agents must support Markdown rendering explicitly by default - never omit this capability',
    source: { kind: 'user', timestamp: Date.parse('2025-08-04T21:20:00Z') },
    content: 'All chat-based agents MUST support Markdown rendering explicitly by default. Always explicitly ensure Markdown rendering is included in chat-agent components. Never omit Markdown rendering capability.',
    entities: ['Markdown rendering', 'chat agents', 'default capability', 'rendering support'],
    tags: ['markdown', 'rendering', 'chatAgents', 'defaultCapability', 'formatting', 'principle'],
    scores: { priority: 1.0, contextStrength: 1.0, temporalRelevance: 1.0, actionability: 0.95, novelty: 0.6 },
    createdAt: '2025-08-04T21:20:00Z'
  });

  // Update Options Immediately
  await addCard({
    id: 'card_2025-08-14_update_options',
    cardType: 'concept',
    title: 'Update Options Immediately',
    summary: 'Integrate new functionalities explicitly into clearly defined UI options as soon as they are introduced',
    source: { kind: 'user', timestamp: Date.parse('2025-08-04T21:20:00Z') },
    content: 'When new functionalities are introduced, immediately add them explicitly to the options available in the UI. Always immediately integrate new functionality into clearly defined UI options. Never leave new features undocumented or hidden.',
    entities: ['new functionality', 'UI options', 'feature integration', 'immediate integration'],
    tags: ['UI', 'functionality', 'options', 'integration', 'usability', 'principle'],
    scores: { priority: 0.9, contextStrength: 0.95, temporalRelevance: 0.9, actionability: 0.85, novelty: 0.6 },
    createdAt: '2025-08-04T21:20:00Z'
  });

  // Admonitions for Response Structure
  await addCard({
    id: 'card_2025-08-14_admonitions',
    cardType: 'concept',
    title: 'Admonitions for Response Structure',
    summary: 'Use colored container admonitions or borders to visually delineate sections within AI responses for better comprehension',
    source: { kind: 'user', timestamp: Date.parse('2025-08-04T21:25:00Z') },
    content: 'AI language models often separate their responses into distinct sections (e.g., Chain of Thought, Inner Monologue, Stage Directions, Bullet Points). To improve readability and help users mentally categorize information, utilize colored container admonitions or colored borders. This visual aid prevents users from skimming over important content within large blocks of text.',
    entities: ['admonitions', 'response formatting', 'visual delineation', 'colored borders', 'readability'],
    tags: ['AI', 'responseFormatting', 'admonitions', 'markdown', 'userExperience', 'technique'],
    scores: { priority: 0.85, contextStrength: 0.8, temporalRelevance: 0.9, actionability: 0.75, novelty: 0.8 },
    createdAt: '2025-08-04T21:25:00Z'
  });

  // AI Multi-Modal Awareness
  await addCard({
    id: 'card_2025-08-14_ai_verification',
    cardType: 'concept',
    title: 'AI Multi-Modal Awareness',
    summary: 'Always independently verify the stated capabilities of AI tools - do not assume AI self-reported abilities are accurate',
    source: { kind: 'user', timestamp: Date.parse('2025-08-04T21:00:00Z') },
    content: 'Always independently verify the stated capabilities of an AI tool, especially when critical operations or data integrity are involved. Do not assume an AI\'s self-reported abilities are accurate; cross-reference them with documented features or through direct testing. The AI\'s desire to be helpful can sometimes lead it to attempt tasks it cannot perform, resulting in errors.',
    entities: ['AI capabilities', 'verification', 'self-reported abilities', 'capability testing', 'AI limitations'],
    tags: ['AI', 'verification', 'capabilities', 'safety', 'userTrust', 'technique'],
    scores: { priority: 0.9, contextStrength: 0.85, temporalRelevance: 0.8, actionability: 0.8, novelty: 0.7 },
    createdAt: '2025-08-04T21:00:00Z'
  });

  console.log('🎯 Batch 3 rapid import completed!');
}

main().catch(console.error);