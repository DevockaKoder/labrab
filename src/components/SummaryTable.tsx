import React, { useState } from 'react';
import { StudentSubmission, TaskCheckResult } from '../types';
import {
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  ShieldAlert,
  ArrowUpDown,
  Bot,
  UserCheck,
  Upload,
  Archive,
  RotateCcw,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { generateStudentFeedback, formatScore } from '../utils/feedbackGenerator';
import { cleanStudentDisplayName } from '../utils/codeParser';

interface SummaryTableProps {
  submissions: StudentSubmission[];
  onSelectStudent: (id: string) => void;
  onNavigateToSimilarity: (studentAId: string, studentBId: string) => void;
  onToggleArchive?: (studentId: string) => void;
  onOpenUpload?: () => void;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({
  submissions,
  onSelectStudent,
  onNavigateToSimilarity,
  onToggleArchive,
  onOpenUpload,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedStudentId, setCopiedStudentId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'grade3' | 'score' | 'name' | 'group' | 'similarity' | 'ai'>('grade3');
  const [sortAsc, setSortAsc] = useState(false);
  // Audit columns (Plagiarism and AI) are collapsed by default to fit comfortably without scrolling
  const [showAuditColumns, setShowAuditColumns] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  if (submissions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Ведомость пуста</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
          Загрузите файлы лабораторных работ студентов (.py или .zip), чтобы сформировать сводную ведомость успеваемости по 3-балльной шкале, результатам тестов и проверке на плагиат/ИИ.
        </p>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-100"
          >
            <Upload className="w-4 h-4" />
            <span>Загрузить работы студентов</span>
          </button>
        )}
      </div>
    );
  }

  // Unique groups for filtering
  const groups = Array.from(
    new Set(submissions.map((s) => s.groupName || 'Группа 1'))
  ).filter(Boolean).sort();

  // Filter by group
  const visibleSubmissions = selectedGroup === 'all'
    ? submissions
    : submissions.filter((s) => (s.groupName || 'Группа 1') === selectedGroup);

  // Sorting: archived submissions always go to the bottom
  const sortedSubmissions = [...visibleSubmissions].sort((a, b) => {
    // If one is archived and the other isn't, archived always goes to the bottom
    if (!!a.isArchived !== !!b.isArchived) {
      return a.isArchived ? 1 : -1;
    }

    let cmp = 0;
    if (sortBy === 'grade3') {
      cmp = (b.gradeScale3 ?? 0) - (a.gradeScale3 ?? 0);
      if (cmp === 0) cmp = b.totalScore - a.totalScore;
    } else if (sortBy === 'score') {
      cmp = b.totalScore - a.totalScore;
    } else if (sortBy === 'name') {
      const nameA = cleanStudentDisplayName(a.studentName);
      const nameB = cleanStudentDisplayName(b.studentName);
      cmp = nameA.localeCompare(nameB);
    } else if (sortBy === 'group') {
      const grpA = a.groupName || 'Группа 1';
      const grpB = b.groupName || 'Группа 1';
      cmp = grpA.localeCompare(grpB);
      if (cmp === 0) {
        cmp = cleanStudentDisplayName(a.studentName).localeCompare(cleanStudentDisplayName(b.studentName));
      }
    } else if (sortBy === 'similarity') {
      const simA = a.topSimilarity?.similarityPercent || 0;
      const simB = b.topSimilarity?.similarityPercent || 0;
      cmp = simB - simA;
    } else if (sortBy === 'ai') {
      const aiA = a.aiDetection?.aiProbability || 0;
      const aiB = b.aiDetection?.aiProbability || 0;
      cmp = aiB - aiA;
    }
    return sortAsc ? -cmp : cmp;
  });

  const hasSuspiciousSubmissions = submissions.some(
    (s) => (s.topSimilarity?.similarityPercent || 0) >= 70 || s.aiDetection?.verdict === 'likely_ai'
  );

  const handleCopyStudentFeedback = (sub: StudentSubmission, e: React.MouseEvent) => {
    e.stopPropagation();
    const feedback = generateStudentFeedback(sub);
    navigator.clipboard.writeText(feedback);
    setCopiedStudentId(sub.id);
    setTimeout(() => {
      setCopiedStudentId((current) => (current === sub.id ? null : current));
    }, 2000);
  };

  const handleExportCSV = () => {
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += 'ФИО Студента,Группа,Файл,Оценка (3-балльная),Вердикт шкалы,Набрано баллов (зачётных),Всего баллов,Процент,Макс. схожесть,С кем совпадение,Вероятность ИИ,Вердикт ИИ,Отзыв для студента\n';

    sortedSubmissions.forEach((s) => {
      const cleanName = cleanStudentDisplayName(s.studentName);
      const grp = s.groupName || 'Группа 1';
      const simWith = s.topSimilarity ? `"${s.topSimilarity.withStudentName}"` : '—';
      const simVal = s.topSimilarity ? `${s.topSimilarity.similarityPercent}%` : '0%';
      const aiProb = s.aiDetection ? `${s.aiDetection.aiProbability}%` : '—';
      const aiVerdict = s.aiDetection
        ? s.aiDetection.verdict === 'likely_ai'
          ? 'Высокий риск ИИ'
          : s.aiDetection.verdict === 'suspicious'
          ? 'Подозрение на ИИ'
          : 'Самостоятельно'
        : '—';
      const gradeTitle = s.gradeScale3Details?.verdictTitle || `Оценка ${s.gradeScale3}`;
      const scoreStr = formatScore(s.totalScore);
      const maxScoreStr = formatScore(s.maxPossibleScore);
      const feedbackEscaped = generateStudentFeedback(s).replace(/"/g, '""');
      csv += `"${cleanName}","${grp}","${s.fileName}",${s.gradeScale3},"${gradeTitle}",${scoreStr},${maxScoreStr},${s.gradePercentage}%,${simVal},${simWith},${aiProb},"${aiVerdict}","${feedbackEscaped}"\n`;
    });

    const isLab3 = submissions.some((s) => s.labId === 'lab3');
    const isLab2 = submissions.some((s) => s.labId === 'lab2');
    const labNumber = isLab3 ? 3 : isLab2 ? 2 : 1;
    const groupSuffix = selectedGroup !== 'all' ? `_${selectedGroup.replace(/\s+/g, '_')}` : '';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ведомость_Лабораторная_${labNumber}${groupSuffix}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const isLab3 = submissions.some((s) => s.labId === 'lab3');
    const isLab2 = submissions.some((s) => s.labId === 'lab2');
    const labNumber = isLab3 ? 3 : isLab2 ? 2 : 1;
    let text = `СВОДНАЯ ВЕДОМОСТЬ: Лабораторная работа №${labNumber} (Python)\n`;
    text += `Шкала: 3 - отлично, 2 - есть ошибки, 1 - много ошибок/ИИ, 0 - не зачтено\n`;
    text += `Дата формирования: ${new Date().toLocaleDateString()}\n\n`;
    text += `№ | ФИО Студента | Группа | Оценка (0-3) | Баллы | %\n`;
    text += `----------------------------------------------------------\n`;

    sortedSubmissions.forEach((s, idx) => {
      const cleanName = cleanStudentDisplayName(s.studentName);
      const grp = s.groupName || 'Группа 1';
      const scoreStr = formatScore(s.totalScore);
      const maxScoreStr = formatScore(s.maxPossibleScore);
      text += `${idx + 1}. ${cleanName} | ${grp} | Оценка: ${s.gradeScale3} | ${scoreStr}/${maxScoreStr} | ${Math.round(s.gradePercentage)}%\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const avgScore =
    visibleSubmissions.reduce((acc, s) => acc + s.totalScore, 0) / (visibleSubmissions.length || 1);
  const countGrade3 = visibleSubmissions.filter((s) => s.gradeScale3 === 3).length;
  const countGrade2 = visibleSubmissions.filter((s) => s.gradeScale3 === 2).length;
  const countGrade1 = visibleSubmissions.filter((s) => s.gradeScale3 === 1).length;
  const countGrade0 = visibleSubmissions.filter((s) => s.gradeScale3 === 0).length;

  return (
    <div className="space-y-5">
      {/* Top summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">
            {selectedGroup === 'all' ? 'Всего студентов' : `Студентов (${selectedGroup})`}
          </span>
          <span className="text-xl font-bold text-slate-900">{visibleSubmissions.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-xs text-emerald-800 font-medium block">Оценка 3 (отлично)</span>
          <span className="text-xl font-bold text-emerald-700">
            {countGrade3}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({Math.round((countGrade3 / (visibleSubmissions.length || 1)) * 100)}%)
            </span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-xs text-amber-800 font-medium block">Оценка 2 (есть ошибки)</span>
          <span className="text-xl font-bold text-amber-700">
            {countGrade2}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({Math.round((countGrade2 / (visibleSubmissions.length || 1)) * 100)}%)
            </span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-orange-200 bg-orange-50/20 shadow-xs">
          <span className="text-xs text-orange-800 font-medium block">Оценка 1 (ошибки / ИИ)</span>
          <span className="text-xl font-bold text-orange-700">
            {countGrade1}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({Math.round((countGrade1 / (visibleSubmissions.length || 1)) * 100)}%)
            </span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <span className="text-xs text-rose-800 font-medium block">Оценка 0 (не работает)</span>
          <span className="text-xl font-bold text-rose-700">
            {countGrade0}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({Math.round((countGrade0 / (visibleSubmissions.length || 1)) * 100)}%)
            </span>
          </span>
        </div>
      </div>

      {/* 3-Point Scale Legend Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <span>Шкала оценивания:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11.5px]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">3</span>
            <span>1 несущественная ошибка допустима</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">2</span>
            <span>Есть ошибки (выполнено)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-xs">1</span>
            <span>Много ошибок или нейросеть</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">0</span>
            <span>Ничего не работает</span>
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-900">Сводная ведомость</h3>
              {visibleSubmissions.some((s) => s.isArchived) && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Архив: {visibleSubmissions.filter((s) => s.isArchived).length} (перенесены вниз)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {(() => {
                const isLab3 = submissions.some((s) => s.labId === 'lab3');
                const isLab2 = submissions.some((s) => s.labId === 'lab2');
                const max = submissions[0]?.maxPossibleScore || (isLab3 ? 20 : isLab2 ? 25 : 18);
                const note = isLab3
                  ? '(все 20 основных заданий зачётные)'
                  : isLab2
                  ? '(все 25 заданий зачётные, доп. не требуются)'
                  : '(задачи-примеры 1.1, 2.1, 3.1, 3.2, 4.1 исключены)';
                return `Средний зачётный балл: ${formatScore(avgScore)} / ${max} ${note}`;
              })()}
            </p>
          </div>

          {/* Controls: Group Filter, Collapsible Audit Toggle, Copy Summary, Export CSV */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Group Filter */}
            {groups.length > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">Группа:</span>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="text-xs bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all">Все ({submissions.length})</option>
                  {groups.map((grp) => {
                    const count = submissions.filter((s) => (s.groupName || 'Группа 1') === grp).length;
                    return (
                      <option key={grp} value={grp}>
                        {grp} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Toggle Collapsible Audit Columns (Hidden by default) */}
            <button
              onClick={() => setShowAuditColumns(!showAuditColumns)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                showAuditColumns
                  ? 'bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
                  : hasSuspiciousSubmissions
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={
                showAuditColumns
                  ? 'Скрыть колонки плагиата и ИИ (для компактного вида)'
                  : 'Развернуть колонки проверки на плагиат и ИИ'
              }
            >
              {showAuditColumns ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Скрыть проверки (ИИ / Плагиат)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Показать проверки (ИИ / Плагиат)</span>
                  {hasSuspiciousSubmissions && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Есть совпадения" />
                  )}
                </>
              )}
            </button>

            {/* Copy Summary */}
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Копировать сводку</span>
                </>
              )}
            </button>

            {/* Export CSV (now includes student feedback column) */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
              title="Экспорт ведомости с оценками и текстами отзывов в Excel/CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Экспорт в CSV</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3 font-medium w-10 text-center">№</th>
                <th
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setSortBy('name');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Студент</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setSortBy('group');
                    setSortAsc(!sortAsc);
                  }}
                  title="Сортировать по группам"
                >
                  <div className="flex items-center gap-1">
                    <span>Группа</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setSortBy('grade3');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900">Оценка (0–3)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setSortBy('score');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Зачётные баллы</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 font-medium">%</th>

                {/* Quick Actions (Copy Feedback + Archive) immediately after Scored Points */}
                <th className="p-3 font-semibold text-indigo-700 bg-indigo-50/40 border-x border-indigo-100/60 whitespace-nowrap">
                  Быстрые действия
                </th>

                {/* Collapsible Audit Columns */}
                {showAuditColumns && (
                  <>
                    <th
                      className="p-3 font-medium cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        setSortBy('similarity');
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Схожесть (Плагиат)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="p-3 font-medium cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        setSortBy('ai');
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Контроль ИИ</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </>
                )}

                <th className="p-3 font-medium text-right">Детали</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSubmissions.map((sub, idx) => {
                const isHighRisk = (sub.topSimilarity?.similarityPercent || 0) >= 70;
                const cleanName = cleanStudentDisplayName(sub.studentName);

                return (
                  <tr
                    key={sub.id}
                    className={`transition-colors ${
                      sub.isArchived
                        ? 'bg-slate-50/75 opacity-75 hover:opacity-100 hover:bg-slate-100/60'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>

                    {/* Student name: clean ФИО + raw file in tooltip & subtitle */}
                    <td className="p-3 font-semibold text-slate-900 max-w-[220px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => onSelectStudent(sub.id)}
                          className="hover:text-indigo-600 text-left truncate font-semibold"
                          title={`Открыть работу студента: ${sub.studentName} (${sub.fileName})`}
                        >
                          {cleanName}
                        </button>
                        {(Object.values(sub.results) as TaskCheckResult[]).some((r) => r.isLoopTimeout) && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300"
                            title="В коде был зафиксирован бесконечный цикл, остановлен защитой"
                          >
                            ⚡ Цикл
                          </span>
                        )}
                        {(Object.values(sub.results) as TaskCheckResult[]).some((r) => r.isMemoryLimitExceeded) && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-900 border border-purple-300"
                            title="В коде зафиксировано переполнение памяти, остановлено защитой"
                          >
                            🛡️ Память
                          </span>
                        )}
                        {sub.isArchived && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-600 font-medium">
                            В архиве
                          </span>
                        )}
                      </div>
                      <span
                        className="block text-[11px] font-normal text-slate-400 font-mono truncate"
                        title={sub.fileName}
                      >
                        {sub.fileName}
                      </span>
                    </td>

                    {/* Group */}
                    <td className="p-3 text-slate-600 font-mono whitespace-nowrap">
                      {sub.groupName || 'Группа 1'}
                    </td>

                    {/* 3-Point Grade Cell */}
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          sub.gradeScale3 === 3
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : sub.gradeScale3 === 2
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : sub.gradeScale3 === 1
                            ? 'bg-orange-50 text-orange-800 border-orange-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                        title={sub.gradeScale3Details?.description}
                      >
                        <span className="text-sm font-extrabold">{sub.gradeScale3}</span>
                        <span className="text-[10px] font-medium opacity-80">
                          {sub.gradeScale3 === 3 ? 'Отлично' : sub.gradeScale3 === 2 ? 'Хорошо' : sub.gradeScale3 === 1 ? 'Есть ошибки' : 'Не работает'}
                        </span>
                      </span>
                    </td>

                    {/* Scored Points */}
                    <td className="p-3 font-bold text-slate-900 font-mono whitespace-nowrap">
                      {formatScore(sub.totalScore)} / {formatScore(sub.maxPossibleScore)}
                    </td>

                    {/* Percentage */}
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          sub.gradePercentage >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.gradePercentage >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {Math.round(sub.gradePercentage)}%
                      </span>
                    </td>

                    {/* QUICK ACTIONS: Copy Feedback + Archive right next to score */}
                    <td className="p-3 whitespace-nowrap bg-indigo-50/25 border-x border-indigo-100/40">
                      <div className="flex items-center gap-1.5">
                        {/* Copy Clean Student Feedback */}
                        <button
                          onClick={(e) => handleCopyStudentFeedback(sub, e)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs ${
                            copiedStudentId === sub.id
                              ? 'bg-emerald-600 text-white shadow-emerald-200'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300'
                          }`}
                          title="Скопировать готовый отзыв студенту (без ИИ и лишних заметок)"
                        >
                          {copiedStudentId === sub.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Скопирован!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Отзыв</span>
                            </>
                          )}
                        </button>

                        {/* Archive / Unarchive */}
                        {onToggleArchive && (
                          <button
                            onClick={() => onToggleArchive(sub.id)}
                            className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              sub.isArchived
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                            title={
                              sub.isArchived
                                ? 'Вернуть из архива в активный список'
                                : 'Убрать в архив (перенести вниз списка)'
                            }
                          >
                            {sub.isArchived ? (
                              <>
                                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="hidden lg:inline text-[11px]">Вернуть</span>
                              </>
                            ) : (
                              <>
                                <Archive className="w-3.5 h-3.5 text-slate-500" />
                                <span className="hidden lg:inline text-[11px]">В архив</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Collapsible Audit Columns (Only if showAuditColumns is true) */}
                    {showAuditColumns && (
                      <>
                        <td className="p-3 whitespace-nowrap">
                          {sub.topSimilarity ? (
                            <div className="flex items-center gap-1.5">
                              {isHighRisk && <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />}
                              <span
                                className={`font-semibold ${
                                  isHighRisk
                                    ? 'text-rose-600'
                                    : sub.topSimilarity.similarityPercent >= 45
                                    ? 'text-amber-600'
                                    : 'text-slate-600'
                                }`}
                              >
                                {sub.topSimilarity.similarityPercent}%
                              </span>
                              <span
                                className="text-[11px] text-slate-400 truncate max-w-[120px]"
                                title={sub.topSimilarity.withStudentName}
                              >
                                с {cleanStudentDisplayName(sub.topSimilarity.withStudentName)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {sub.aiDetection ? (
                            sub.aiDetection.verdict === 'likely_ai' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-100 text-violet-800 border border-violet-200">
                                <Bot className="w-3 h-3 text-violet-600" />
                                {sub.aiDetection.aiProbability}% ИИ
                              </span>
                            ) : sub.aiDetection.verdict === 'suspicious' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                <Bot className="w-3 h-3 text-amber-600" />
                                {sub.aiDetection.aiProbability}% Подозр.
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                                <UserCheck className="w-3 h-3 text-emerald-600" />
                                {sub.aiDetection.aiProbability}% Сам
                              </span>
                            )
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </>
                    )}

                    {/* Actions on the far right */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudent(sub.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100"
                        >
                          Решения
                        </button>
                        {sub.topSimilarity && (
                          <button
                            onClick={() =>
                              onNavigateToSimilarity(
                                sub.id,
                                sub.topSimilarity!.withStudentId
                              )
                            }
                            className="px-2 py-1 rounded-md text-xs font-medium text-rose-600 hover:bg-rose-50"
                            title="Сравнить схожесть кода"
                          >
                            Сравнить
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
