export interface TestCase {
  id: string;
  description: string;
  inputs: (string | number)[];
  expectedValueDescription: string;
  validator?: (stdout: string, inputs: (string | number)[]) => {
    passed: boolean;
    details: string;
    expected: string;
    actual: string;
  };
}

export interface AstCheckRule {
  id: string;
  title: string;
  description: string;
  checkType: 'forbid_min_max' | 'require_for_loop' | 'require_while_loop' | 'custom_check';
}

export interface LabTask {
  id: string; // e.g. "1.1", "1.2", "2.1"
  section: string; // "I. Линейный алгоритм", "II. Условный алгоритм", etc.
  title: string;
  condition: string;
  formulaDescription?: string;
  sampleCode?: string;
  isSample?: boolean; // If it's a sample problem from the manual
  astRules?: AstCheckRule[];
  testCases: TestCase[];
}

export interface TaskCheckResult {
  taskId: string;
  taskTitle: string;
  codeFound: boolean;
  studentSnippet: string;
  status: 'passed' | 'failed' | 'syntax_error' | 'not_found' | 'skipped';
  score: number; // 0 to 1
  isSample?: boolean; // Excluded from total grading score
  tests: {
    testId: string;
    description: string;
    inputs: (string | number)[];
    passed: boolean;
    expected: string;
    actual: string;
    errorMessage?: string;
  }[];
  astChecks: {
    ruleId: string;
    ruleTitle: string;
    passed: boolean;
    message: string;
  }[];
  runtimeError?: string;
  stdoutLogs?: string;
}

export interface AiMarker {
  id: string;
  name: string;
  description: string;
  detected: boolean;
  weight: number;
  evidence?: string;
}

export interface AiDetectionResult {
  aiProbability: number; // 0 to 100
  verdict: 'human' | 'suspicious' | 'likely_ai';
  markers: AiMarker[];
  explanation: string;
  source: 'heuristic' | 'gemini';
  defenseQuestions: string[];
}

export type GradeScale3 = 0 | 1 | 2 | 3;

export interface GradeScale3Details {
  score: GradeScale3;
  label: string; // e.g. "3 / 3"
  verdictTitle: string; // "Отлично", "Есть ошибки", "Много ошибок / Нейросеть", "Ничего не работает"
  description: string;
  badgeColor: string;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  groupName?: string;
  fileName: string;
  rawCode: string;
  uploadedAt: string;
  tasks: { [taskId: string]: string }; // snippet per task
  results: { [taskId: string]: TaskCheckResult };
  totalScore: number;
  maxPossibleScore: number;
  gradePercentage: number;
  gradeScale3: GradeScale3;
  gradeScale3Details: GradeScale3Details;
  aiDetection?: AiDetectionResult;
  topSimilarity?: {
    withStudentId: string;
    withStudentName: string;
    similarityPercent: number;
    suspiciousTaskId?: string;
  };
}

export interface SimilarityPair {
  studentAId: string;
  studentAName: string;
  studentBId: string;
  studentBName: string;
  overallSimilarityPercent: number;
  taskSimilarities: {
    taskId: string;
    similarityPercent: number;
    tokenSimilarity: number;
    structuralSimilarity: number;
    exactMatchesCount: number;
  }[];
  riskLevel: 'high' | 'medium' | 'low';
}
