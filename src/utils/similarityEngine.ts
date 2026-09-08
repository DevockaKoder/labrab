import { StudentSubmission, SimilarityPair } from '../types';

// Reserved Python keywords and builtins that should NOT be anonymized
const PYTHON_KEYWORDS = new Set([
  'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif',
  'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
  'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
  'while', 'with', 'yield', 'print', 'input', 'int', 'float', 'str', 'len',
  'range', 'sum', 'min', 'max', 'math', 'sqrt', 'pi', 'abs', 'round', 'True',
  'False', 'None'
]);

/**
 * Normalizes Python code:
 * 1. Strips comments (# ...) and docstrings ('''...''' and """...""")
 * 2. Normalizes string literals to "STR"
 * 3. Canonicalizes identifiers (renaming variables to v1, v2, v3 in order of appearance)
 * 4. Normalizes whitespace and indentation
 */
export function normalizePythonCode(code: string): { normalized: string; tokens: string[] } {
  if (!code) return { normalized: '', tokens: [] };

  // 1. Remove comments
  let cleaned = code.replace(/#.*$/gm, '');

  // 2. Remove triple-quoted strings
  cleaned = cleaned.replace(/"""[\s\S]*?"""|'''[\s\S]*?'''/g, ' ');

  // 3. Replace string literals with token '__STR__'
  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '__STR__');

  // 4. Tokenize into words, numbers, and operators
  const rawTokens = cleaned.match(/[A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?|[+\-*/%&|^=<>!]=?|\*\*|\/\/|[()\[\]{},:]/g) || [];

  const varMap = new Map<string, string>();
  let varCounter = 1;

  const normalizedTokens = rawTokens.map((tok) => {
    if (PYTHON_KEYWORDS.has(tok)) {
      return tok;
    }
    // Operator or number
    if (!/^[A-Za-z_]/.test(tok)) {
      return tok;
    }
    // Variable or function name: anonymize to v1, v2, ...
    if (!varMap.has(tok)) {
      varMap.set(tok, `v${varCounter++}`);
    }
    return varMap.get(tok)!;
  });

  return {
    normalized: normalizedTokens.join(' '),
    tokens: normalizedTokens,
  };
}

/**
 * Generates character or token n-grams
 */
function getNGrams(tokens: string[], n = 3): Set<string> {
  const ngrams = new Set<string>();
  if (tokens.length < n) {
    ngrams.add(tokens.join('_'));
    return ngrams;
  }
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join('_'));
  }
  return ngrams;
}

/**
 * Jaccard similarity between two sets of n-grams (0 to 1)
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Compute similarity percentage between two code snippets (0 to 100)
 */
export function calculateCodeSimilarity(codeA: string, codeB: string): {
  similarityPercent: number;
  tokenSimilarity: number;
  structuralSimilarity: number;
} {
  if (!codeA.trim() || !codeB.trim()) {
    return { similarityPercent: 0, tokenSimilarity: 0, structuralSimilarity: 0 };
  }

  const normA = normalizePythonCode(codeA);
  const normB = normalizePythonCode(codeB);

  // Exact normalized match
  if (normA.normalized === normB.normalized && normA.tokens.length > 5) {
    return { similarityPercent: 100, tokenSimilarity: 100, structuralSimilarity: 100 };
  }

  // 3-grams of normalized tokens (invariance to variable renaming)
  const ngramsA = getNGrams(normA.tokens, 3);
  const ngramsB = getNGrams(normB.tokens, 3);
  const tokenSim = jaccardSimilarity(ngramsA, ngramsB);

  // 2-grams for structural control flow
  const struct2A = getNGrams(normA.tokens, 2);
  const struct2B = getNGrams(normB.tokens, 2);
  const structSim = jaccardSimilarity(struct2A, struct2B);

  // Raw token overlap (multiset bag of words)
  const bagA: Record<string, number> = {};
  const bagB: Record<string, number> = {};
  normA.tokens.forEach((t) => (bagA[t] = (bagA[t] || 0) + 1));
  normB.tokens.forEach((t) => (bagB[t] = (bagB[t] || 0) + 1));

  let commonCount = 0;
  for (const [t, count] of Object.entries(bagA)) {
    if (bagB[t]) {
      commonCount += Math.min(count, bagB[t]);
    }
  }
  const bagSim = (2 * commonCount) / (normA.tokens.length + normB.tokens.length || 1);

  // Weighted score
  const combined = tokenSim * 0.5 + structSim * 0.3 + bagSim * 0.2;
  const percentage = Math.min(100, Math.round(combined * 100));

  return {
    similarityPercent: percentage,
    tokenSimilarity: Math.round(tokenSim * 100),
    structuralSimilarity: Math.round(structSim * 100),
  };
}

/**
 * Compares all pairs of students and updates similarity matrices
 */
export function compareAllSubmissions(submissions: StudentSubmission[]): SimilarityPair[] {
  const pairs: SimilarityPair[] = [];

  for (let i = 0; i < submissions.length; i++) {
    for (let j = i + 1; j < submissions.length; j++) {
      const subA = submissions[i];
      const subB = submissions[j];

      // Compare whole files
      const fullCodeSim = calculateCodeSimilarity(subA.rawCode, subB.rawCode);

      // Compare task by task
      const allTaskIds = Array.from(new Set([...Object.keys(subA.tasks), ...Object.keys(subB.tasks)]));
      const taskSimilarities = allTaskIds.map((taskId) => {
        const codeA = subA.tasks[taskId] || '';
        const codeB = subB.tasks[taskId] || '';
        const sim = calculateCodeSimilarity(codeA, codeB);
        return {
          taskId,
          similarityPercent: sim.similarityPercent,
          tokenSimilarity: sim.tokenSimilarity,
          structuralSimilarity: sim.structuralSimilarity,
          exactMatchesCount: codeA.trim() === codeB.trim() && codeA.trim().length > 10 ? 1 : 0,
        };
      });

      // Filter tasks where both submitted
      const activeTasks = taskSimilarities.filter((t) => (subA.tasks[t.taskId] && subB.tasks[t.taskId]));
      const avgTaskSim = activeTasks.length > 0
        ? activeTasks.reduce((acc, t) => acc + t.similarityPercent, 0) / activeTasks.length
        : 0;

      // Overall similarity is max of full code comparison and average of active tasks
      const overallSim = Math.round(Math.max(fullCodeSim.similarityPercent, avgTaskSim));

      let riskLevel: 'high' | 'medium' | 'low' = 'low';
      if (overallSim >= 75) riskLevel = 'high';
      else if (overallSim >= 45) riskLevel = 'medium';

      pairs.push({
        studentAId: subA.id,
        studentAName: subA.studentName,
        studentBId: subB.id,
        studentBName: subB.studentName,
        overallSimilarityPercent: overallSim,
        taskSimilarities,
        riskLevel,
      });
    }
  }

  // Sort pairs by highest similarity descending
  pairs.sort((a, b) => b.overallSimilarityPercent - a.overallSimilarityPercent);

  // Update topSimilarity on each submission
  submissions.forEach((sub) => {
    let highestSim = 0;
    let partnerId = '';
    let partnerName = '';
    let suspiciousTask = '';

    pairs.forEach((p) => {
      let otherId = '';
      let otherName = '';
      if (p.studentAId === sub.id) {
        otherId = p.studentBId;
        otherName = p.studentBName;
      } else if (p.studentBId === sub.id) {
        otherId = p.studentAId;
        otherName = p.studentAName;
      }

      if (otherId && p.overallSimilarityPercent > highestSim) {
        highestSim = p.overallSimilarityPercent;
        partnerId = otherId;
        partnerName = otherName;
        const worstTask = [...p.taskSimilarities].sort((a, b) => b.similarityPercent - a.similarityPercent)[0];
        suspiciousTask = worstTask ? worstTask.taskId : undefined;
      }
    });

    if (highestSim > 0) {
      sub.topSimilarity = {
        withStudentId: partnerId,
        withStudentName: partnerName,
        similarityPercent: highestSim,
        suspiciousTaskId: suspiciousTask,
      };
    }
  });

  return pairs;
}
