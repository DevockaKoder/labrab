import { AiDetectionResult, AiMarker } from '../types';

/**
 * Fast client-side heuristic/stylometric AI detection for Python Lab 1 code.
 * Detects patterns that LLMs (ChatGPT, Copilot, Claude) habitually inject
 * but that 1st-year students learning introductory Python IDLE almost never write.
 */
export function analyzeCodeForAiHeuristics(code: string): AiDetectionResult {
  const lines = code.split('\n');
  const markers: AiMarker[] = [];

  // 1. Type annotations in functions or variables (e.g. def func(x: float) -> float:)
  const typeHintRegex = /def\s+\w+\s*\([^)]*:\s*(?:int|float|str|bool|List|Tuple|Dict|Any)[^)]*\)\s*->\s*(?:int|float|str|bool|List|Tuple|Dict|Any|None)/i;
  const simpleVarTypeRegex = /\b[a-zA-Z_]\w*\s*:\s*(?:int|float|str|bool)\s*=/;
  const hasTypeHints = typeHintRegex.test(code) || simpleVarTypeRegex.test(code);
  const typeHintEvidence = lines.find((l) => typeHintRegex.test(l) || simpleVarTypeRegex.test(l))?.trim();

  markers.push({
    id: 'type_hints',
    name: 'Аннотации типов (Type Hints)',
    description: 'Использование type hints (-> float, x: int). Первокурсники в лабораторной №1 по IDLE не используют аннотации типов.',
    detected: hasTypeHints,
    weight: 25,
    evidence: typeHintEvidence,
  });

  // 2. Formal Google/Sphinx style docstrings or algorithmic descriptions
  const docstringRegex = /"""[\s\S]*?(?:Args:|Returns:|Parameters:|Raises:|Raises\b|:param|:return)[\s\S]*?"""/i;
  const multiLineDocstringRegex = /"""[\s\S]{30,}?"""/;
  const hasDocstrings = docstringRegex.test(code) || multiLineDocstringRegex.test(code);
  const docstringEvidence = lines.find((l) => l.trim().startsWith('"""') || l.trim().startsWith("'''"))?.trim();

  markers.push({
    id: 'docstrings',
    name: 'Формальные докстринги (Docstrings)',
    description: 'Многострочные комментарии в формате Google/Sphinx с описанием параметров и возвращаемых значений, характерные для генераций LLM.',
    detected: hasDocstrings,
    weight: 20,
    evidence: docstringEvidence,
  });

  // 3. Defensive error handling (try...except ValueError) in basic I/O
  const tryExceptRegex = /try\s*:[\s\S]*?except\s+(?:ValueError|Exception|TypeError)/;
  const hasTryExcept = tryExceptRegex.test(code);
  const tryEvidence = lines.find((l) => /except\s+(?:ValueError|Exception|TypeError)/.test(l))?.trim();

  markers.push({
    id: 'try_except',
    name: 'Защитное программирование (try-except)',
    description: 'Перехват исключений ValueError при вводе данных через input(). Лабораторная предполагает прямое чтение без промышленной валидации.',
    detected: hasTryExcept,
    weight: 20,
    evidence: tryEvidence,
  });

  // 4. Boilerplate entrypoint `if __name__ == '__main__':`
  const mainBoilerplateRegex = /if\s+__name__\s*==\s*['"]__main__['"]\s*:/;
  const hasMainBoilerplate = mainBoilerplateRegex.test(code);
  const mainEvidence = lines.find((l) => mainBoilerplateRegex.test(l))?.trim();

  markers.push({
    id: 'main_guard',
    name: 'Конструкция if __name__ == "__main__"',
    description: 'Шаблонная точка входа, которую ChatGPT по умолчанию добавляет в конец любого скрипта.',
    detected: hasMainBoilerplate,
    weight: 15,
    evidence: mainEvidence,
  });

  // 5. Over-engineered libraries (typing, sys, functools, dataclasses)
  const advancedImportsRegex = /import\s+(?:sys|typing|functools|itertools|dataclasses)|from\s+(?:typing|functools|itertools)\s+import/;
  const hasAdvancedImports = advancedImportsRegex.test(code);
  const importEvidence = lines.find((l) => advancedImportsRegex.test(l))?.trim();

  markers.push({
    id: 'advanced_imports',
    name: 'Продвинутые стандартные библиотеки',
    description: 'Импорт модулей typing, sys, functools или itertools в вводной лабораторной работе.',
    detected: hasAdvancedImports,
    weight: 20,
    evidence: importEvidence,
  });

  // 6. Typical AI English commentary or step-by-step markers
  const aiCommentRegex = /#\s*(?:Step\s+\d+|Initialize|Calculate\s+(?:the\s+)?|Input\s+validation|Edge\s+case|Main\s+execution|Formula:|Compute)/i;
  const hasAiComments = aiCommentRegex.test(code);
  const commentEvidence = lines.find((l) => aiCommentRegex.test(l))?.trim();

  markers.push({
    id: 'ai_comments',
    name: 'Шаблонные комментарии на английском языке',
    description: 'Англоязычные пояснения (# Step 1: ..., # Input validation), автоматически оставляемые нейросетью.',
    detected: hasAiComments,
    weight: 15,
    evidence: commentEvidence,
  });

  // 7. Advanced functional one-liners instead of loops in beginner lab
  // e.g. sum(1/(k**5) for k in range(...)) or [x for x in ...]
  const sumGenRegex = /sum\s*\(\s*[^)]+\s+for\s+\w+\s+in\s+range\s*\(/;
  const hasSumGen = sumGenRegex.test(code);
  const sumGenEvidence = lines.find((l) => sumGenRegex.test(l))?.trim();

  markers.push({
    id: 'comprehensions_in_loops',
    name: 'Генераторные выражения вместо базовых циклов',
    description: 'Использование sum(...) с генератором в задачах блока III (цикл for), где методичка требует ручной цикл-накопитель.',
    detected: hasSumGen,
    weight: 15,
    evidence: sumGenEvidence,
  });

  // Calculate score
  const totalWeight = markers.filter((m) => m.detected).reduce((acc, m) => acc + m.weight, 0);
  // Normalize score between 5% (base baseline) and 98%
  let aiProbability = Math.min(Math.round(totalWeight * 0.95), 98);
  if (aiProbability < 10) {
    aiProbability = Math.max(aiProbability, 6); // Natural student baseline
  }

  // Verdict
  let verdict: 'human' | 'suspicious' | 'likely_ai' = 'human';
  if (aiProbability >= 60) {
    verdict = 'likely_ai';
  } else if (aiProbability >= 30) {
    verdict = 'suspicious';
  }

  // Explanation text
  let explanation = '';
  const detectedNames = markers.filter((m) => m.detected).map((m) => m.name);
  if (verdict === 'likely_ai') {
    explanation = `Высокая вероятность генерации искусственным интеллектом (${aiProbability}%). В коде обнаружены маркеры, несвойственные студентам вводного курса: ${detectedNames.join(', ')}. Код переусложнён и содержит академические паттерны LLM.`;
  } else if (verdict === 'suspicious') {
    explanation = `Умеренное подозрение на использование ИИ (${aiProbability}%). Обнаружены отдельные нетипичные конструкции (${detectedNames.join(', ')}), рекомендуется задать контрольные вопросы.`;
  } else {
    explanation = `Признаков генерации ИИ не обнаружено (вероятность ${aiProbability}%). Код написан простым императивным стилем, характерным для начинающего изучать Python.`;
  }

  // Generate targeted defense questions (вопросы на защиту)
  const defenseQuestions: string[] = [];
  if (hasTypeHints) {
    defenseQuestions.push(
      'Что означает конструкция -> float в объявлении функции и выдаст ли Python ошибку при запуске, если вернуть строку?'
    );
  }
  if (hasTryExcept) {
    defenseQuestions.push(
      'Зачем здесь блок try...except ValueError? Что конкретно перехватывает это исключение и как программа поведёт себя без него?'
    );
  }
  if (hasSumGen) {
    defenseQuestions.push(
      'Перепишите задачу на вычисление ряда (3.5 или 3.6) через классический цикл for с переменной-накопителем sum = sum + ..., не используя функцию sum() и генератор.'
    );
  }
  if (hasMainBoilerplate) {
    defenseQuestions.push(
      'Для чего нужна проверка if __name__ == "__main__"? Какое значение принимает переменная __name__ при импорте этого файла как модуля в другой скрипт?'
    );
  }
  if (defenseQuestions.length === 0) {
    defenseQuestions.push(
      'Объясните, почему в задаче 2.4 условия расположены именно в таком порядке и что произойдет при x = -1?'
    );
    defenseQuestions.push(
      'Как работает третий аргумент в функции range(2, 21, 2) в задаче 3.2?'
    );
    defenseQuestions.push(
      'В чем принципиальное отличие цикла while от цикла for и когда следует предпочесть while?'
    );
  }

  return {
    aiProbability,
    verdict,
    markers,
    explanation,
    source: 'heuristic',
    defenseQuestions: defenseQuestions.slice(0, 3),
  };
}

/**
 * Call backend Gemini AI endpoint for deep contextual semantic analysis
 */
export async function analyzeCodeWithGemini(
  code: string,
  studentName: string,
  fileName: string
): Promise<AiDetectionResult | null> {
  try {
    const res = await fetch('/api/analyze-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, studentName, fileName }),
    });

    if (!res.ok) {
      console.warn('Backend Gemini API endpoint returned status:', res.status);
      return null;
    }

    const data = await res.json();
    return data as AiDetectionResult;
  } catch (err) {
    console.warn('Failed to contact /api/analyze-ai, falling back to heuristics:', err);
    return null;
  }
}
