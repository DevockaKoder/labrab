import { StudentSubmission, LabTask } from '../types';
import { LAB1_TASKS } from '../data/lab1Tasks';
import { LAB2_TASKS } from '../data/lab2Tasks';
import { LAB3_TASKS } from '../data/lab3Tasks';
import { LAB4_TASKS } from '../data/lab4Tasks';

/**
 * Cleanly formats a number without floating point artifacts like 15.999999999999996.
 * Returns integer representation if whole, or single decimal place (e.g. 11.2).
 */
export function formatScore(num: number): string {
  const rounded = Math.round(num * 10) / 10;
  if (Math.abs(rounded - Math.round(rounded)) < 0.0001) {
    return Math.round(rounded).toString();
  }
  return rounded.toFixed(1);
}

/**
 * Returns the relevant tasks for the given lab ID.
 */
export function getTasksForLab(labId?: 'lab1' | 'lab2' | 'lab3' | 'lab4'): LabTask[] {
  if (labId === 'lab4') return LAB4_TASKS;
  if (labId === 'lab3') return LAB3_TASKS;
  if (labId === 'lab2') return LAB2_TASKS;
  return LAB1_TASKS;
}

/**
 * Generates a clean, student-facing review/feedback text.
 * Strips out all AI heuristics, internal plagiarism detection, and unnecessary preambles.
 *
 * Format requested by user:
 * Зачётные задачи: набрано 11.2 из 20 (56%)
 * Замечания и нерешённые задания (10):
 * - Задание 11 (Округление вещественных чисел...): Ошибка — нарушено требование методички (Ошибка: ...)
 */
export function generateStudentFeedback(sub: StudentSubmission): string {
  const labTasks = getTasksForLab(sub.labId);
  const gradedTasks = labTasks.filter((t) => !t.isSample);

  // Identify problem tasks (not found, failed, syntax error, loop timeout, memory exceeded)
  const problemTasks = gradedTasks.filter((t) => {
    const r = sub.results[t.id];
    return !r || r.status === 'not_found' || r.status === 'failed' || r.status === 'syntax_error';
  });

  const scoreStr = formatScore(sub.totalScore);
  const maxScoreStr = formatScore(sub.maxPossibleScore);
  const percentStr = Math.round(sub.gradePercentage);

  let text = `Зачётные задачи: набрано ${scoreStr} из ${maxScoreStr} (${percentStr}%)\n`;

  if (problemTasks.length === 0) {
    text += `Замечаний нет, все задания решены верно!`;
  } else {
    text += `Замечания и нерешённые задания (${problemTasks.length}):\n`;
    problemTasks.forEach((t) => {
      const r = sub.results[t.id];
      if (!r || r.status === 'not_found') {
        text += `- Задание ${t.id} (${t.title}): Не решено / отсутствует в файле\n`;
      } else if (r.isLoopTimeout) {
        text += `- Задание ${t.id} (${t.title}): Бесконечный цикл — программа зацикливается, проверьте условие выхода из while/for\n`;
      } else if (r.isMemoryLimitExceeded) {
        text += `- Задание ${t.id} (${t.title}): Переполнение памяти — код создаёт огромные данные или бесконечно печатает в print()\n`;
      } else if (r.status === 'syntax_error') {
        text += `- Задание ${t.id} (${t.title}): Синтаксическая ошибка — ${r.runtimeError || 'код не компилируется'}\n`;
      } else {
        const astViol = r.astChecks?.find((a) => !a.passed)?.message;
        const failMsg =
          r.runtimeError ||
          r.tests?.find((test) => !test.passed)?.errorMessage ||
          'Несовпадение ответа с эталоном';
        const reason = astViol ? `нарушено требование методички (${astViol})` : failMsg;
        text += `- Задание ${t.id} (${t.title}): Ошибка — ${reason}\n`;
      }
    });
  }

  return text.trim();
}
