import { Passage } from '@/types';

export const PASSAGES: Passage[] = [
  // --- English Prose ---
  {
    id: 'eng-1',
    title: 'The Art of Fluid Typing',
    content: 'Keyboard mastery is not simply an act of speed, but a symphony of rhythm and precision. When your fingers dance across the mechanical switches without conscious deliberation, the barrier between mind and screen disappears, leaving only pure thought translated into light.',
    language: 'english',
    difficulty: 'medium',
    category: 'prose',
    source: 'Keyora Philosophy',
    wordCount: 39,
  },
  {
    id: 'eng-2',
    title: 'Echoes of the Digital Dawn',
    content: 'In the quiet glow of the cathode ray tube, the early hackers forged the foundations of cyberspace. Every keystroke was deliberate, carved into magnetic tape and silicon wafers. They dreamed of interconnected minds wandering freely through an endless digital frontier.',
    language: 'english',
    difficulty: 'easy',
    category: 'prose',
    source: 'Cyber Chronicles',
    wordCount: 42,
  },
  {
    id: 'eng-3',
    title: 'The Kinetic Flow of Code',
    content: 'True engineering is an aesthetic discipline where elegant algorithms mirror natural laws. A well-crafted function exhibits balance, clarity, and parsimonious beauty. As you write, consider how each character ripples outward into the architecture of modern civilization.',
    language: 'english',
    difficulty: 'hard',
    category: 'prose',
    source: 'Craftsmanship Notes',
    wordCount: 37,
  },
  {
    id: 'eng-4',
    title: 'Speed and Silence',
    content: 'The quick brown fox jumps over the lazy dog. Bright vixens jump, dozy fowl quack. Sphinx of black quartz, judge my vow. How quickly daft jumping zebras vex. Pack my box with five dozen liquor jugs.',
    language: 'english',
    difficulty: 'easy',
    category: 'prose',
    source: 'Pangram Collection',
    wordCount: 34,
  },
  // --- Code Snippets ---
  {
    id: 'code-1',
    title: 'TypeScript Async Pipeline',
    content: 'async function fetchTypingLeaderboard(limit: number = 10): Promise<Entry[]> { const res = await fetch(`/api/leaderboard?limit=${limit}`); if (!res.ok) throw new Error("Failed to load records"); return await res.json(); }',
    language: 'code',
    difficulty: 'medium',
    category: 'javascript',
    source: 'Keyora Core API',
    wordCount: 29,
  },
  {
    id: 'code-2',
    title: 'Python Binary Search Tree',
    content: 'def insert(node, val): if not node: return TreeNode(val) if val < node.val: node.left = insert(node.left, val) else: node.right = insert(node.right, val) return node',
    language: 'code',
    difficulty: 'hard',
    category: 'python',
    source: 'Algorithms Lab',
    wordCount: 28,
  },
  {
    id: 'code-3',
    title: 'Rust Memory Safety & Concurrency',
    content: 'pub fn calculate_wpm(chars: usize, seconds: f64) -> f64 { if seconds <= 0.0 { return 0.0; } ((chars as f64) / 5.0) / (seconds / 60.0) }',
    language: 'code',
    difficulty: 'hard',
    category: 'javascript',
    source: 'Keyora Engine',
    wordCount: 24,
  },
  // --- Inspiring Quotes ---
  {
    id: 'quote-1',
    title: 'Alan Kay on the Future',
    content: 'The best way to predict the future is to invent it. People who are really serious about software should make their own hardware.',
    language: 'quotes',
    difficulty: 'easy',
    category: 'quotes',
    source: 'Alan Kay',
    wordCount: 23,
  },
  {
    id: 'quote-2',
    title: 'Ada Lovelace on the Engine',
    content: 'The Analytical Engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves. We may say most aptly that the Analytical Engine is an embodying of the science of operations.',
    language: 'quotes',
    difficulty: 'hard',
    category: 'quotes',
    source: 'Ada Lovelace',
    wordCount: 32,
  },
  {
    id: 'quote-3',
    title: 'Steve Jobs on Focus',
    content: 'People think focus means saying yes to the thing you have got to focus on. But that is not what it means at all. It means saying no to the hundred other good ideas that there are.',
    language: 'quotes',
    difficulty: 'medium',
    category: 'quotes',
    source: 'Steve Jobs',
    wordCount: 36,
  },
  // --- Numbers & Symbols ---
  {
    id: 'num-1',
    title: 'Numeric Matrix & Punctuation',
    content: 'In 2026, 4,892 active nodes transmitted 192.168.1.1:8080 packets at 99.85% efficiency. Calculated profit was $7,450,120.50 (an increase of +14.2% over Q3). Note: 3.1415926535 * 42 = 131.94689.',
    language: 'numbers',
    difficulty: 'hard',
    category: 'numbers',
    source: 'Data Ledger',
    wordCount: 23,
  },
  // --- Spanish ---
  {
    id: 'esp-1',
    title: 'El Arte de Escribir con Rapidez',
    content: 'El teclado no es simplemente una herramienta tecnica sino una extension natural del pensamiento. Con practica constante y concentracion serena, cada pulsacion se convierte en un pulso armonico que da vida a las palabras.',
    language: 'spanish',
    difficulty: 'medium',
    category: 'prose',
    source: 'Keyora Internacional',
    wordCount: 34,
  }
];

export const COMMON_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they',
  'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his',
  'from', 'they', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would',
  'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
  'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
  'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'code', 'speed', 'flow', 'focus', 'light',
  'system', 'world', 'power', 'mind', 'rhythm', 'key', 'stream', 'pulse', 'spark', 'shift'
];

export function getRandomWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
    words.push(COMMON_WORDS[randomIndex]);
  }
  return words.join(' ');
}
