import React, { useState } from 'react';
import { StudentSubmission } from '../types';
import { LAB1_TASKS } from '../data/lab1Tasks';
import { Download, Copy, Check, FileSpreadsheet, ShieldAlert, ArrowUpDown, Bot, UserCheck, Upload, Archive, RotateCcw } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const [sortBy, setSortBy] = useState<'grade3' | 'score' | 'name' | 'similarity' | 'ai'>('grade3');
  const [sortAsc, setSortAsc] = useState(false);

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

  // Sorting: archived submissions always go to the bottom
  const sortedSubmissions = [...submissions].sort((a, b) => {
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
      cmp = a.studentName.localeCompare(b.studentName);
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

  const handleExportCSV = () => {
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += 'ФИО Студента,Группа,Файл,Оценка (3-балльная),Вердикт шкалы,Набрано баллов (зачётных),Всего баллов,Процент,Макс. схожесть,С кем совпадение,Вероятность ИИ,Вердикт ИИ\n';

    sortedSubmissions.forEach((s) => {
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
      csv += `"${s.studentName}","${s.groupName}","${s.fileName}",${s.gradeScale3},"${gradeTitle}",${s.totalScore},${s.maxPossibleScore},${s.gradePercentage}%,${simVal},${simWith},${aiProb},"${aiVerdict}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ведомость_Лабораторная_1_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    let text = `СВОДНАЯ ВЕДОМОСТЬ: Лабораторная работа №1 (Python IDLE)\n`;
    text += `Шкала: 3 - 1 несущ. ошибка допустима, 2 - есть ошибки, 1 - много ошибок/ИИ, 0 - ничего не работает\n`;
    text += `Дата формирования: ${new Date().toLocaleDateString()}\n\n`;
    text += `№ | ФИО Студента | Группа | Оценка (0-3) | Баллы | % | Плагиат | ИИ-контроль\n`;
    text += `------------------------------------------------------------------------------------\n`;

    sortedSubmissions.forEach((s, idx) => {
      const sim = s.topSimilarity ? `${s.topSimilarity.similarityPercent}% (${s.topSimilarity.withStudentName})` : '—';
      const ai = s.aiDetection ? `${s.aiDetection.aiProbability}% (${s.aiDetection.verdict})` : '—';
      text += `${idx + 1}. ${s.studentName} | ${s.groupName} | Оценка: ${s.gradeScale3} | ${s.totalScore}/${s.maxPossibleScore} | ${s.gradePercentage}% | ${sim} | ${ai}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const avgScore =
    submissions.reduce((acc, s) => acc + s.totalScore, 0) / (submissions.length || 1);
  const countGrade3 = submissions.filter((s) => s.gradeScale3 === 3).length;
  const countGrade2 = submissions.filter((s) => s.gradeScale3 === 2).length;
  const countGrade1 = submissions.filter((s) => s.gradeScale3 === 1).length;
  const countGrade0 = submissions.filter((s) => s.gradeScale3 === 0).length;
  const aiAlertCount = submissions.filter((s) => s.aiDetection?.verdict === 'likely_ai').length;

  return (
    <div className="space-y-5">
      {/* Top summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Всего студентов</span>
          <span className="text-xl font-bold text-slate-900">{submissions.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-xs text-emerald-800 font-medium block">Оценка 3 (отлично)</span>
          <span className="text-xl font-bold text-emerald-700">
            {countGrade3} <span className="text-xs font-normal text-slate-500">({Math.round((countGrade3 / submissions.length) * 100)}%)</span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-xs text-amber-800 font-medium block">Оценка 2 (есть ошибки)</span>
          <span className="text-xl font-bold text-amber-700">
            {countGrade2} <span className="text-xs font-normal text-slate-500">({Math.round((countGrade2 / submissions.length) * 100)}%)</span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-orange-200 bg-orange-50/20 shadow-xs">
          <span className="text-xs text-orange-800 font-medium block">Оценка 1 (ошибки / ИИ)</span>
          <span className="text-xl font-bold text-orange-700">
            {countGrade1} <span className="text-xs font-normal text-slate-500">({Math.round((countGrade1 / submissions.length) * 100)}%)</span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <span className="text-xs text-rose-800 font-medium block">Оценка 0 (не работает)</span>
          <span className="text-xl font-bold text-rose-700">
            {countGrade0} <span className="text-xs font-normal text-slate-500">({Math.round((countGrade0 / submissions.length) * 100)}%)</span>
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
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Итоговая ведомость группы</h3>
              {submissions.some((s) => s.isArchived) && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Архив: {submissions.filter((s) => s.isArchived).length} (перенесены вниз)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Средний зачётный балл: {Math.round(avgScore * 10) / 10} / {submissions[0]?.maxPossibleScore || LAB1_TASKS.filter((t) => !t.isSample).length} (задачи-примеры 1.1, 2.1, 3.1, 3.2, 4.1 исключены)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {copied ? (
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

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Экспорт в Excel (CSV)</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3 font-medium w-12 text-center">№</th>
                <th
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600"
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
                <th className="p-3 font-medium">Группа</th>
                <th
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600"
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
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600"
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
                <th
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600"
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
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600"
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
                <th className="p-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSubmissions.map((sub, idx) => {
                const isHighRisk = (sub.topSimilarity?.similarityPercent || 0) >= 70;
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
                    <td className="p-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectStudent(sub.id)}
                          className="hover:text-indigo-600 text-left"
                        >
                          {sub.studentName}
                        </button>
                        {sub.isArchived && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-600 font-medium">
                            Архив
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] font-normal text-slate-400 font-mono">{sub.fileName}</span>
                    </td>
                    <td className="p-3 text-slate-600 font-mono">{sub.groupName}</td>
                    
                    {/* 3-Point Grade Cell */}
                    <td className="p-3">
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
                          {sub.gradeScale3 === 3 ? 'Отлично' : sub.gradeScale3 === 2 ? 'Хорошо' : sub.gradeScale3 === 1 ? 'Много ошибок/ИИ' : 'Не работает'}
                        </span>
                      </span>
                    </td>

                    <td className="p-3 font-bold text-slate-900 font-mono">
                      {sub.totalScore} / {sub.maxPossibleScore}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          sub.gradePercentage >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.gradePercentage >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sub.gradePercentage}%
                      </span>
                    </td>
                    <td className="p-3">
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
                          <span className="text-[11px] text-slate-400 truncate max-w-[120px]" title={sub.topSimilarity.withStudentName}>
                            с {sub.topSimilarity.withStudentName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3">
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
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudent(sub.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium text-indigo-600 hover:bg-indigo-50"
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
                            className="px-2.5 py-1 rounded-md text-xs font-medium text-rose-600 hover:bg-rose-50"
                          >
                            Сравнить
                          </button>
                        )}
                        {onToggleArchive && (
                          <button
                            onClick={() => onToggleArchive(sub.id)}
                            className={`p-1.5 rounded-lg text-xs transition-colors ${
                              sub.isArchived
                                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                            }`}
                            title={
                              sub.isArchived
                                ? 'Вернуть из архива в активный список'
                                : 'Убрать в архив (перенести вниз списка)'
                            }
                          >
                            {sub.isArchived ? (
                              <RotateCcw className="w-3.5 h-3.5" />
                            ) : (
                              <Archive className="w-3.5 h-3.5" />
                            )}
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
