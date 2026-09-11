import { LAB1_TASKS } from '../data/lab1Tasks';
import { StudentSubmission, TaskCheckResult } from '../types';
import { splitCodeIntoTasks, extractStudentHeader } from './codeParser';
import { runPythonCode } from './pythonRunner';
import { analyzeCodeForAiHeuristics } from './aiDetector';
import { calculateGradeScale3 } from './gradeScale';

export async function gradeStudentCode(
  rawCode: string,
  fileName: string,
  onProgress?: (taskIndex: number, totalTasks: number, taskName: string) => void
): Promise<StudentSubmission> {
  const { studentName, groupName } = extractStudentHeader(rawCode, fileName);
  const tasksMap = splitCodeIntoTasks(rawCode, fileName);

  const results: { [taskId: string]: TaskCheckResult } = {};
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (let i = 0; i < LAB1_TASKS.length; i++) {
    const task = LAB1_TASKS[i];
    const isSampleTask = !!task.isSample;

    // Tasks 1.1, 2.1, 3.1, 3.2, 4.1 are manual samples and excluded from overall grading score
    if (!isSampleTask) {
      maxPossibleScore += 1;
    }

    if (onProgress) {
      onProgress(i + 1, LAB1_TASKS.length, `${task.id} - ${task.title}`);
    }

    const snippet = tasksMap[task.id];

    if (!snippet || snippet.trim().length === 0) {
      results[task.id] = {
        taskId: task.id,
        taskTitle: task.title,
        codeFound: false,
        studentSnippet: '',
        status: 'not_found',
        score: 0,
        isSample: isSampleTask,
        tests: [],
        astChecks: [],
      };
      continue;
    }

    // Run tests
    const testResults: TaskCheckResult['tests'] = [];
    const astResults: TaskCheckResult['astChecks'] = [];
    let runtimeError: string | undefined;
    let taskPassed = true;

    // Run first test to capture AST checks
    for (let tIdx = 0; tIdx < task.testCases.length; tIdx++) {
      const tc = task.testCases[tIdx];
      const pyRes = await runPythonCode(snippet, tc.inputs);

      if (pyRes.error && !runtimeError) {
        runtimeError = pyRes.error;
      }

      // Check AST rules on the first run
      if (tIdx === 0 && task.astRules) {
        for (const rule of task.astRules) {
          if (rule.checkType === 'forbid_min_max') {
            const violated = pyRes.astChecks.usedMinMax || snippet.includes('min(') || snippet.includes('max(');
            astResults.push({
              ruleId: rule.id,
              ruleTitle: rule.title,
              passed: !violated,
              message: violated
                ? 'Нарушено условие задачи: обнаружено использование встроенных функций min() или max()'
                : 'Условие соблюдено: функции min/max не использовались',
            });
            if (violated) taskPassed = false;
          } else if (rule.checkType === 'require_for_loop') {
            const hasFor = pyRes.astChecks.hasForLoop || (snippet.includes('for ') && snippet.includes(' in '));
            astResults.push({
              ruleId: rule.id,
              ruleTitle: rule.title,
              passed: hasFor,
              message: hasFor
                ? 'Цикл for обнаружен в коде'
                : 'Ошибка: в коде не обнаружен обязательный цикл for',
            });
            if (!hasFor) taskPassed = false;
          } else if (rule.checkType === 'require_while_loop') {
            const hasWhile = pyRes.astChecks.hasWhileLoop || snippet.includes('while ');
            astResults.push({
              ruleId: rule.id,
              ruleTitle: rule.title,
              passed: hasWhile,
              message: hasWhile
                ? 'Цикл while обнаружен в коде'
                : 'Ошибка: в коде не обнаружен обязательный цикл while',
            });
            if (!hasWhile) taskPassed = false;
          }
        }
      }

      // Validate output
      let passed = false;
      let expected = tc.expectedValueDescription;
      let actual = pyRes.stdout.trim() || (pyRes.error ? `Ошибка: ${pyRes.error}` : 'пустой вывод');
      let details = '';

      if (tc.validator) {
        const vRes = tc.validator(pyRes.stdout, tc.inputs);
        passed = vRes.passed;
        expected = vRes.expected;
        actual = vRes.actual;
        details = vRes.details;
      } else {
        passed = !pyRes.error && pyRes.stdout.length > 0;
      }

      if (pyRes.error) {
        passed = false;
      }

      if (!passed) {
        taskPassed = false;
      }

      testResults.push({
        testId: tc.id,
        description: tc.description,
        inputs: tc.inputs,
        passed,
        expected,
        actual,
        errorMessage: pyRes.error || (details && !passed ? details : undefined),
      });
    }

    const astAllPassed = astResults.every((a) => a.passed);
    const testsAllPassed = testResults.every((t) => t.passed);
    const isOverallSuccess = taskPassed && astAllPassed && testsAllPassed && !runtimeError;

    const taskScore = isOverallSuccess ? 1 : testResults.filter((t) => t.passed).length / (testResults.length || 1) * (astAllPassed ? 0.7 : 0.2);
    const roundedScore = Math.round(taskScore * 10) / 10;

    // Only non-sample tasks contribute to total student score
    if (!isSampleTask) {
      totalScore += roundedScore;
    }

    results[task.id] = {
      taskId: task.id,
      taskTitle: task.title,
      codeFound: true,
      studentSnippet: snippet,
      status: isOverallSuccess ? 'passed' : runtimeError ? 'syntax_error' : 'failed',
      score: roundedScore,
      isSample: isSampleTask,
      tests: testResults,
      astChecks: astResults,
      runtimeError,
    };
  }

  const gradePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 100;
  const aiDetection = analyzeCodeForAiHeuristics(rawCode);
  const gradeScale3Details = calculateGradeScale3(totalScore, maxPossibleScore, results, aiDetection);

  return {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    studentName,
    groupName,
    fileName,
    rawCode,
    uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tasks: tasksMap,
    results,
    totalScore,
    maxPossibleScore,
    gradePercentage,
    gradeScale3: gradeScale3Details.score,
    gradeScale3Details,
    aiDetection,
  };
}
