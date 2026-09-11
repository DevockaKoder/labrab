import { AiDetectionResult, GradeScale3Details, TaskCheckResult } from '../types';

/**
 * Calculates a 3-point grade according to the user's criteria:
 * - 0: ничего не работает
 * - 1: много ошибок или нейросеть
 * - 2: есть ошибки
 * - 3: 1 несущественная ошибка допустима
 */
export function calculateGradeScale3(
  totalScore: number,
  maxPossibleScore: number,
  results: { [taskId: string]: TaskCheckResult },
  aiDetection?: AiDetectionResult
): GradeScale3Details {
  const gradedResults = Object.values(results).filter((r) => !r.isSample);
  const totalGradedCount = maxPossibleScore > 0 ? maxPossibleScore : 20;

  // Passed tasks with full credit (1.0)
  const fullyPassedCount = gradedResults.filter((r) => r.status === 'passed' && r.score >= 0.95).length;
  // Non-passed tasks (syntax errors, not found, or test failures)
  const failedOrMissingCount = gradedResults.filter((r) => r.status !== 'passed' || r.score < 0.95).length;
  // Critical non-functional count (not found or syntax error)
  const brokenCount = gradedResults.filter((r) => r.status === 'syntax_error' || r.status === 'not_found').length;

  const isAiDetected =
    aiDetection?.verdict === 'likely_ai' || (aiDetection?.aiProbability !== undefined && aiDetection.aiProbability >= 50);

  // 0 - ничего не работает
  // Ни одно задание не прошло успешно ИЛИ набрано меньше 2.5 баллов ИЛИ практически весь файл пуст/сломан
  if (fullyPassedCount === 0 || totalScore < 2.5 || brokenCount >= 18) {
    return {
      score: 0,
      label: '0 / 3',
      verdictTitle: 'Ничего не работает',
      description: 'Код не работает, содержит критические ошибки или зачётные задачи не представлены.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    };
  }

  // 1 - много ошибок или нейросеть
  if (isAiDetected) {
    const aiProb = aiDetection?.aiProbability ?? 0;
    return {
      score: 1,
      label: '1 / 3',
      verdictTitle: 'Нейросеть (ИИ)',
      description: `Обнаружены характерные признаки генерации кода нейросетью (вероятность ${aiProb}%). Требуется очная защита.`,
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
    };
  }

  // Много ошибок: набрано меньше 14 баллов (из 20) или 6+ задач с ошибками
  if (totalScore < 14 || failedOrMissingCount >= 6) {
    return {
      score: 1,
      label: '1 / 3',
      verdictTitle: 'Много ошибок',
      description: `В работе допущено много ошибок: ${failedOrMissingCount} задач(и) из ${totalGradedCount} не выполнены или содержат ошибки.`,
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    };
  }

  // 3 - 1 несущественная ошибка допустима
  // 19 или 20 баллов из 20 (т.е. максимум одна несущественная ошибка)
  if (totalScore >= 19.0 || failedOrMissingCount <= 1) {
    const hasOneMinorError = failedOrMissingCount === 1 || totalScore < 20;
    return {
      score: 3,
      label: '3 / 3',
      verdictTitle: hasOneMinorError ? 'Отлично (1 недочёт)' : 'Отлично',
      description: hasOneMinorError
        ? 'Все задания выполнены с одной допустимой несущественной неточностью (19/20 баллов).'
        : 'Все 20 зачётных заданий выполнены полностью верно.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
  }

  // 2 - есть ошибки
  // Набрано от 14 до 18.9 баллов (от 2 до 5 заданий с ошибками)
  return {
    score: 2,
    label: '2 / 3',
    verdictTitle: 'Есть ошибки',
    description: `Работа в целом выполнена, но обнаружены ошибки в ${failedOrMissingCount} заданиях (набрано ${totalScore}/${totalGradedCount} баллов).`,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  };
}
