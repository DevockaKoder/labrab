import React, { useState } from 'react';
import { StudentSubmission, TaskCheckResult } from '../types';
import { LAB1_TASKS } from '../data/lab1Tasks';
import { runPythonCode } from '../utils/pythonRunner';
import { analyzeCodeWithGemini } from '../utils/aiDetector';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileQuestion,
  Play,
  Copy,
  Check,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Terminal,
  Code2,
  ListFilter,
  Bot,
  Sparkles,
  UserCheck,
  HelpCircle,
  Loader2,
  Upload,
} from 'lucide-react';

interface StudentGradingViewProps {
  submissions: StudentSubmission[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onNavigateToSimilarity: (studentAId: string, studentBId: string) => void;
  onDeleteSubmission?: (id: string) => void;
  onUpdateSubmission?: (updated: StudentSubmission) => void;
  onOpenUpload?: () => void;
}

export const StudentGradingView: React.FC<StudentGradingViewProps> = ({
  submissions,
  selectedStudentId,
  onSelectStudent,
  onNavigateToSimilarity,
  onDeleteSubmission,
  onUpdateSubmission,
  onOpenUpload,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed' | 'not_found'>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [isAnalyzingGemini, setIsAnalyzingGemini] = useState(false);

  // Interactive re-test state
  const [customInputs, setCustomInputs] = useState<{ [taskId: string]: string }>({});
  const [interactiveOutput, setInteractiveOutput] = useState<{ [taskId: string]: { stdout: string; error?: string } }>({});
  const [isReRunning, setIsReRunning] = useState<string | null>(null);

  const currentStudent = submissions.find((s) => s.id === selectedStudentId) || submissions[0];

  if (!currentStudent) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <Code2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Работы студентов пока не загружены</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
          Загрузите один или несколько файлов .py (или ZIP-архив с работами студентов группы). Автоматически запустятся тестирование вычислений, AST-проверки ограничений, антиплагиат и оценка по 3-балльной шкале.
        </p>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-100"
          >
            <Upload className="w-4 h-4" />
            <span>Загрузить файлы студентов (.py / .zip)</span>
          </button>
        )}
      </div>
    );
  }

  // Filter tasks
  const tasksToDisplay = LAB1_TASKS.filter((task) => {
    const res = currentStudent.results[task.id];
    if (filterStatus === 'all') return true;
    if (filterStatus === 'passed') return res?.status === 'passed';
    if (filterStatus === 'failed') return res?.status === 'failed' || res?.status === 'syntax_error';
    if (filterStatus === 'not_found') return !res || res.status === 'not_found';
    return true;
  });

  const getStatusBadge = (res?: TaskCheckResult) => {
    if (!res || res.status === 'not_found') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <FileQuestion className="w-3 h-3" /> {res?.isSample ? 'Образец не найден' : 'Не найдено'}
        </span>
      );
    }
    if (res.status === 'passed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" /> {res.isSample ? 'Образец проверен (без оценки)' : 'Пройдено (1 б.)'}
        </span>
      );
    }
    if (res.status === 'syntax_error') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" /> {res.isSample ? 'Ошибка в образце' : 'Ошибка выполнения'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="w-3 h-3 text-amber-600" /> {res.isSample ? 'Замечание по образцу' : `Ошибка в тестах (${res.score} б.)`}
      </span>
    );
  };

  const handleCopyFeedback = () => {
    let report = `Результаты проверки лабораторной работы №1:\n`;
    report += `Студент: ${currentStudent.studentName} (${currentStudent.groupName})\n`;
    report += `Оценка: ${currentStudent.gradeScale3} из 3 (${currentStudent.gradeScale3Details?.verdictTitle || ''})\n`;
    report += `Пояснение: ${currentStudent.gradeScale3Details?.description || ''}\n`;
    report += `Зачётные задачи: набрано ${currentStudent.totalScore} из ${currentStudent.maxPossibleScore} (${currentStudent.gradePercentage}%)\n`;
    report += `Шкала оценивания: 3 - отлично (1 несущественная ошибка допустима), 2 - есть ошибки, 1 - много ошибок или нейросеть, 0 - ничего не работает.\n`;
    report += `Примечание: Задачи 1.1, 2.1, 3.1, 3.2, 4.1 являются примерами из методички и не учитываются в общей оценке успеваемости.\n`;

    if (currentStudent.topSimilarity && currentStudent.topSimilarity.similarityPercent >= 70) {
      report += `\nВнимание: Система зафиксировала повышенную схожесть кода (${currentStudent.topSimilarity.similarityPercent}%) с работой другого студента (${currentStudent.topSimilarity.withStudentName}). Требуется проверка оригинальности.\n`;
    }

    if (currentStudent.aiDetection && currentStudent.aiDetection.aiProbability >= 40) {
      report += `\nКонтроль авторства (ИИ): Вероятность генерации кода составляет ${currentStudent.aiDetection.aiProbability}% (${currentStudent.aiDetection.verdict === 'likely_ai' ? 'Высокая' : 'Умеренная'}).\n`;
      if (currentStudent.aiDetection.defenseQuestions?.length) {
        report += `Вопросы для очной защиты:\n`;
        currentStudent.aiDetection.defenseQuestions.forEach((q, idx) => {
          report += `  ${idx + 1}. ${q}\n`;
        });
      }
    }

    report += `\nДетализация по зачётным заданиям:\n`;
    const gradedTasks = LAB1_TASKS.filter((t) => !t.isSample);
    gradedTasks.forEach((t) => {
      const r = currentStudent.results[t.id];
      if (!r || r.status === 'not_found') {
        report += `- Задание ${t.id} (${t.title}): Не решено / отсутствует в файле (0/1)\n`;
      } else if (r.status === 'passed') {
        report += `- Задание ${t.id} (${t.title}): Выполнено верно (1/1)\n`;
      } else {
        const failMsg = r.runtimeError || r.tests.find((test) => !test.passed)?.errorMessage || 'Несовпадение ответа';
        const astViol = r.astChecks.find((a) => !a.passed)?.message;
        report += `- Задание ${t.id} (${t.title}): Балл: ${r.score}/1. Причина: ${astViol || failMsg}\n`;
      }
    });

    report += `\nЗадания-образцы из методички (без начисления баллов):\n`;
    const sampleTasks = LAB1_TASKS.filter((t) => t.isSample);
    sampleTasks.forEach((t) => {
      const r = currentStudent.results[t.id];
      if (!r || r.status === 'not_found') {
        report += `- Пример ${t.id} (${t.title}): Не найден в файле\n`;
      } else if (r.status === 'passed') {
        report += `- Пример ${t.id} (${t.title}): Проверен корректно\n`;
      } else {
        const failMsg = r.runtimeError || r.tests.find((test) => !test.passed)?.errorMessage || 'Ошибка';
        report += `- Пример ${t.id} (${t.title}): Замечание (${failMsg})\n`;
      }
    });

    navigator.clipboard.writeText(report);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const handleCopyQuestions = () => {
    if (!currentStudent.aiDetection?.defenseQuestions?.length) return;
    const questionsText = currentStudent.aiDetection.defenseQuestions
      .map((q, idx) => `${idx + 1}. ${q}`)
      .join('\n');
    navigator.clipboard.writeText(
      `Контрольные вопросы для устной защиты (${currentStudent.studentName}):\n` + questionsText
    );
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2000);
  };

  const handleRunGeminiAnalysis = async () => {
    if (!currentStudent) return;
    setIsAnalyzingGemini(true);
    try {
      const geminiResult = await analyzeCodeWithGemini(
        currentStudent.rawCode,
        currentStudent.studentName,
        currentStudent.fileName
      );
      if (geminiResult) {
        const updated: StudentSubmission = {
          ...currentStudent,
          aiDetection: geminiResult,
        };
        if (onUpdateSubmission) {
          onUpdateSubmission(updated);
        }
      } else {
        alert('Не удалось связаться с сервером Gemini API или отсутствует GEMINI_API_KEY. Отображен встроенный эвристический анализ.');
      }
    } finally {
      setIsAnalyzingGemini(false);
    }
  };

  const handleRunInteractive = async (taskId: string, code: string) => {
    setIsReRunning(taskId);
    const inputStr = customInputs[taskId] || '';
    const rawInputs = inputStr ? inputStr.split(/\r?\n/).map((s) => s.trim()) : [];
    try {
      const res = await runPythonCode(code, rawInputs);
      setInteractiveOutput((prev) => ({
        ...prev,
        [taskId]: {
          stdout: res.stdout || '(нет вывода print)',
          error: res.error,
        },
      }));
    } catch (err: any) {
      setInteractiveOutput((prev) => ({
        ...prev,
        [taskId]: {
          stdout: '',
          error: err.message,
        },
      }));
    } finally {
      setIsReRunning(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar: Submissions list */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Студенты ({submissions.length})
          </h2>
          <span className="text-[11px] text-slate-400">Выберите для просмотра</span>
        </div>

        <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {submissions.map((sub) => {
            const isSelected = sub.id === currentStudent.id;
            const hasHighSimilarity = (sub.topSimilarity?.similarityPercent || 0) >= 70;

            return (
              <div
                key={sub.id}
                id={`student-item-${sub.id}`}
                onClick={() => onSelectStudent(sub.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {sub.studentName}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono truncate">
                      {sub.groupName} • {sub.fileName}
                    </p>
                  </div>

                  {/* Grade Score 3-Point Pill */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap border shadow-2xs ${
                        sub.gradeScale3 === 3
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : sub.gradeScale3 === 2
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : sub.gradeScale3 === 1
                          ? 'bg-orange-100 text-orange-800 border-orange-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {sub.gradeScale3} / 3 б.
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sub.totalScore}/{sub.maxPossibleScore} зач.
                    </span>
                  </div>
                </div>

                {/* Similarity Risk & AI Badges */}
                <div className="mt-2 pt-2 border-t border-slate-100/80 space-y-1">
                  {sub.topSimilarity && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Схожесть:</span>
                      <span
                        className={`font-semibold inline-flex items-center gap-1 ${
                          hasHighSimilarity
                            ? 'text-rose-600'
                            : sub.topSimilarity.similarityPercent >= 40
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {hasHighSimilarity && <ShieldAlert className="w-3 h-3 text-rose-500" />}
                        {sub.topSimilarity.similarityPercent}%
                      </span>
                    </div>
                  )}

                  {sub.aiDetection && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Контроль ИИ:</span>
                      {sub.aiDetection.verdict === 'likely_ai' ? (
                        <span className="font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.2 rounded border border-violet-200 inline-flex items-center gap-1">
                          <Bot className="w-3 h-3 text-violet-600" />
                          ИИ {sub.aiDetection.aiProbability}%
                        </span>
                      ) : sub.aiDetection.verdict === 'suspicious' ? (
                        <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 inline-flex items-center gap-1">
                          <Bot className="w-3 h-3 text-amber-600" />
                          Подозрение {sub.aiDetection.aiProbability}%
                        </span>
                      ) : (
                        <span className="text-emerald-700 inline-flex items-center gap-1 font-medium">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          Сам ({sub.aiDetection.aiProbability}%)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panel: Selected Student Details */}
      <div className="lg:col-span-8 space-y-4">
        {/* Student Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">{currentStudent.studentName}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                  {currentStudent.groupName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Файл: <span className="font-mono text-slate-700">{currentStudent.fileName}</span> • Загружено в {currentStudent.uploadedAt}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyFeedback}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Скопировать готовый фидбек для отправки студенту"
              >
                {copiedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Отзыв для студента</span>
                  </>
                )}
              </button>

              {onDeleteSubmission && (
                <button
                  onClick={() => onDeleteSubmission(currentStudent.id)}
                  className="px-2 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Удалить эту работу"
                >
                  Удалить
                </button>
              )}
            </div>
          </div>

          {/* Plagiarism Banner if applicable */}
          {currentStudent.topSimilarity && currentStudent.topSimilarity.similarityPercent >= 70 && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold">Обнаружена аномальная схожесть: </span>
                  <span>
                    Код на {currentStudent.topSimilarity.similarityPercent}% совпадает с работой{' '}
                    <strong>{currentStudent.topSimilarity.withStudentName}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  onNavigateToSimilarity(
                    currentStudent.id,
                    currentStudent.topSimilarity!.withStudentId
                  )
                }
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white whitespace-nowrap shadow-xs"
              >
                Сравнить код построчно
              </button>
            </div>
          )}

          {/* 3-Point Grade Hero Banner */}
          <div
            className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              currentStudent.gradeScale3 === 3
                ? 'bg-emerald-50/70 border-emerald-200'
                : currentStudent.gradeScale3 === 2
                ? 'bg-amber-50/70 border-amber-200'
                : currentStudent.gradeScale3 === 1
                ? 'bg-orange-50/70 border-orange-200'
                : 'bg-rose-50/70 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold font-mono border shadow-xs flex-shrink-0 ${
                  currentStudent.gradeScale3 === 3
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : currentStudent.gradeScale3 === 2
                    ? 'bg-amber-600 text-white border-amber-700'
                    : currentStudent.gradeScale3 === 1
                    ? 'bg-orange-600 text-white border-orange-700'
                    : 'bg-rose-600 text-white border-rose-700'
                }`}
              >
                <span className="text-2xl leading-none">{currentStudent.gradeScale3}</span>
                <span className="text-[10px] font-sans font-medium opacity-90">из 3</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base text-slate-900">
                    Оценка: {currentStudent.gradeScale3Details?.verdictTitle || `${currentStudent.gradeScale3} из 3`}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-white/90 text-slate-700 border border-slate-200/80">
                    3-балльная шкала
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                  {currentStudent.gradeScale3Details?.description || ''}
                </p>
              </div>
            </div>

            {/* Criteria mini-legend */}
            <div className="text-[11px] text-slate-600 bg-white/90 p-2.5 rounded-lg border border-slate-200/80 sm:max-w-xs flex-shrink-0">
              <span className="font-semibold text-slate-800 block mb-1">Шкала оценивания:</span>
              <div className="space-y-0.5 text-[10.5px]">
                <div><strong className="text-emerald-700">3</strong> — 1 несущественная ошибка допустима</div>
                <div><strong className="text-amber-700">2</strong> — есть ошибки (работа выполнена)</div>
                <div><strong className="text-orange-700">1</strong> — много ошибок или нейросеть</div>
                <div><strong className="text-rose-700">0</strong> — ничего не работает</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Оценка (шкала 0–3)</span>
              <span className="text-lg font-bold text-slate-900">
                {currentStudent.gradeScale3} / 3 б.
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Зачётный балл</span>
              <span className="text-lg font-bold text-slate-900">
                {currentStudent.totalScore} / {currentStudent.maxPossibleScore} ({currentStudent.gradePercentage}%)
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Зачётных решено</span>
              <span className="text-lg font-bold text-slate-900">
                {(Object.values(currentStudent.results) as TaskCheckResult[]).filter((r) => r.status === 'passed' && !r.isSample).length} / {LAB1_TASKS.filter((t) => !t.isSample).length}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Макс. схожесть</span>
              <span
                className={`text-lg font-bold ${
                  (currentStudent.topSimilarity?.similarityPercent || 0) >= 70
                    ? 'text-rose-600'
                    : 'text-slate-700'
                }`}
              >
                {currentStudent.topSimilarity?.similarityPercent || 0}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 text-center">
            Задачи 1.1, 2.1, 3.1, 3.2, 4.1 являются примерами из методички и исключены из общей оценки успеваемости (в зачёт входят 20 задач).
          </p>
        </div>

        {/* AI Detection Card */}
        {currentStudent.aiDetection && (
          <div
            className={`rounded-2xl border p-5 shadow-xs transition-all ${
              currentStudent.aiDetection.verdict === 'likely_ai'
                ? 'bg-gradient-to-br from-violet-50/70 via-white to-purple-50/50 border-violet-200'
                : currentStudent.aiDetection.verdict === 'suspicious'
                ? 'bg-gradient-to-br from-amber-50/70 via-white to-yellow-50/50 border-amber-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    currentStudent.aiDetection.verdict === 'likely_ai'
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                      : currentStudent.aiDetection.verdict === 'suspicious'
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Проверка на использование ИИ (ChatGPT / Copilot)
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        currentStudent.aiDetection.verdict === 'likely_ai'
                          ? 'bg-violet-100 text-violet-800 border border-violet-200'
                          : currentStudent.aiDetection.verdict === 'suspicious'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {currentStudent.aiDetection.verdict === 'likely_ai'
                        ? 'Высокая вероятность ИИ'
                        : currentStudent.aiDetection.verdict === 'suspicious'
                        ? 'Умеренное подозрение'
                        : 'Написано самостоятельно'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Источник анализа: {currentStudent.aiDetection.source === 'gemini' ? 'Семантическая модель Gemini 3.8 Flash' : 'Эвристический профиль IDLE 1 курса'}
                  </p>
                </div>
              </div>

              {/* Action Button: Deep Gemini Analysis */}
              <button
                onClick={handleRunGeminiAnalysis}
                disabled={isAnalyzingGemini}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                title="Запустить глубокую нейросетевую проверку через Gemini API"
              >
                {isAnalyzingGemini ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Анализирую код...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Глубокий анализ (Gemini)</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Probability Meter */}
            <div className="mt-3.5">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Оценка вероятности генерации:</span>
                <span
                  className={
                    currentStudent.aiDetection.verdict === 'likely_ai'
                      ? 'text-violet-700 font-bold'
                      : currentStudent.aiDetection.verdict === 'suspicious'
                      ? 'text-amber-700 font-bold'
                      : 'text-emerald-700 font-bold'
                  }
                >
                  {currentStudent.aiDetection.aiProbability}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentStudent.aiDetection.verdict === 'likely_ai'
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600'
                      : currentStudent.aiDetection.verdict === 'suspicious'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${currentStudent.aiDetection.aiProbability}%` }}
                />
              </div>
            </div>

            {/* Explanation */}
            <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200/70">
              {currentStudent.aiDetection.explanation}
            </p>

            {/* Detected Markers */}
            {currentStudent.aiDetection.markers.some((m) => m.detected) && (
              <div className="mt-3 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Обнаруженные характерные признаки:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentStudent.aiDetection.markers
                    .filter((m) => m.detected)
                    .map((marker) => (
                      <div
                        key={marker.id}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <span className="w-2 h-2 rounded-full bg-violet-500" />
                          <span>{marker.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {marker.description}
                        </p>
                        {marker.evidence && (
                          <div className="mt-1 font-mono text-[10px] bg-slate-50 text-violet-900 px-2 py-1 rounded border border-slate-100 truncate">
                            Пример: {marker.evidence}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Defense Questions for Professor */}
            {currentStudent.aiDetection.defenseQuestions && currentStudent.aiDetection.defenseQuestions.length > 0 && (
              <div className="mt-4 pt-3.5 border-t border-slate-200/70">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Рекомендуемые вопросы студенту на очную защиту:
                    </span>
                  </div>
                  <button
                    onClick={handleCopyQuestions}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedQuestions ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>Копировать вопросы</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-1.5">
                  {currentStudent.aiDetection.defenseQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-800 bg-white/90 p-2.5 rounded-xl border border-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-snug">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Task Filters */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <ListFilter className="w-3.5 h-3.5 text-slate-400" />
            <span>Фильтр:</span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Все ({LAB1_TASKS.length})
            </button>
            <button
              onClick={() => setFilterStatus('passed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'passed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Пройдено (
              {(Object.values(currentStudent.results) as TaskCheckResult[]).filter((r) => r.status === 'passed').length}
              )
            </button>
            <button
              onClick={() => setFilterStatus('failed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'failed'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Ошибки (
              {
                (Object.values(currentStudent.results) as TaskCheckResult[]).filter(
                  (r) => r.status === 'failed' || r.status === 'syntax_error'
                ).length
              }
              )
            </button>
            <button
              onClick={() => setFilterStatus('not_found')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'not_found'
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Не найдено (
              {(Object.values(currentStudent.results) as TaskCheckResult[]).filter((r) => r.status === 'not_found').length}
              )
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasksToDisplay.map((task) => {
            const res = currentStudent.results[task.id];
            const isExpanded = expandedTask === task.id;

            return (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-mono font-bold text-xs text-slate-700 border border-slate-200 flex-shrink-0">
                      {task.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
                        {task.isSample && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                            Пример из методички (не оценивается)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{task.condition}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(res)}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/30">
                    {/* Condition details */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <span className="font-semibold text-slate-700 block mb-1">
                        Условие из методички:
                      </span>
                      <p className="text-slate-600">{task.condition}</p>
                      {task.formulaDescription && (
                        <div className="mt-1.5 text-indigo-700 font-mono text-[11px] bg-indigo-50/60 p-1.5 rounded-md border border-indigo-100">
                          Формула: {task.formulaDescription}
                        </div>
                      )}
                    </div>

                    {/* AST Checks (restrictions) */}
                    {res && res.astChecks.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-700">
                          Методические проверки (AST анализ кода):
                        </span>
                        {res.astChecks.map((ast, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                              ast.passed
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                                : 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {ast.passed ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                              )}
                              <span>{ast.message}</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                              {ast.passed ? 'Соблюдено' : 'Нарушено'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Test cases table */}
                    {res && res.tests.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-700">
                          Результаты автоматических тестов вывода:
                        </span>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100/75 text-slate-600 border-b border-slate-200">
                              <tr>
                                <th className="p-2.5 font-medium">Тестовый сценарий</th>
                                <th className="p-2.5 font-medium">Входные данные input()</th>
                                <th className="p-2.5 font-medium">Ожидаемый вывод</th>
                                <th className="p-2.5 font-medium">Вывод студента</th>
                                <th className="p-2.5 font-medium text-right">Результат</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {res.tests.map((t, idx) => (
                                <tr key={idx} className={t.passed ? 'hover:bg-slate-50' : 'bg-rose-50/30 hover:bg-rose-50/60'}>
                                  <td className="p-2.5 font-medium text-slate-800">{t.description}</td>
                                  <td className="p-2.5 font-mono text-slate-600">
                                    {t.inputs.length > 0 ? t.inputs.join(', ') : '—'}
                                  </td>
                                  <td className="p-2.5 font-mono text-indigo-700 font-medium">
                                    {t.expected}
                                  </td>
                                  <td className="p-2.5 font-mono text-slate-800">
                                    {t.actual || '—'}
                                  </td>
                                  <td className="p-2.5 text-right">
                                    {t.passed ? (
                                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                                        <CheckCircle className="w-3.5 h-3.5" /> OK
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-xs">
                                        <XCircle className="w-3.5 h-3.5" /> Ошибка
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Student Code Snippet */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-slate-500" />
                          Код решения студента для задачи {task.id}:
                        </span>
                        {res?.codeFound && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {res.studentSnippet.split('\n').length} строк
                          </span>
                        )}
                      </div>

                      {res?.codeFound ? (
                        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-3 text-xs font-mono text-emerald-400 max-h-56 overflow-y-auto">
                          <pre className="whitespace-pre-wrap">{res.studentSnippet}</pre>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 bg-white">
                          В файле студента не обнаружен фрагмент для задачи {task.id} (комментарий #{task.id})
                        </div>
                      )}
                    </div>

                    {/* Interactive re-run with custom inputs */}
                    {res?.codeFound && (
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-xs font-semibold text-slate-800 block">
                          Интерактивная проверка с произвольными данными
                        </span>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Входные значения через перевод строки или пробел (например: 10)"
                            value={customInputs[task.id] || ''}
                            onChange={(e) =>
                              setCustomInputs((prev) => ({ ...prev, [task.id]: e.target.value }))
                            }
                            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          />
                          <button
                            onClick={() => handleRunInteractive(task.id, res.studentSnippet)}
                            disabled={isReRunning === task.id}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{isReRunning === task.id ? 'Запуск...' : 'Запустить'}</span>
                          </button>
                        </div>

                        {interactiveOutput[task.id] && (
                          <div className="mt-2 p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs">
                            <span className="text-slate-400 text-[10px] block mb-1">Вывод в stdout:</span>
                            <pre className="whitespace-pre-wrap">
                              {interactiveOutput[task.id].stdout}
                            </pre>
                            {interactiveOutput[task.id].error && (
                              <div className="text-rose-400 text-xs mt-1">
                                Ошибка: {interactiveOutput[task.id].error}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
