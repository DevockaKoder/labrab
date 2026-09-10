import React, { useState } from 'react';
import { StudentSubmission } from '../types';
import { LAB1_TASKS } from '../data/lab1Tasks';
import { Download, Copy, Check, FileSpreadsheet, ShieldAlert, ArrowUpDown, Bot, UserCheck } from 'lucide-react';

interface SummaryTableProps {
  submissions: StudentSubmission[];
  onSelectStudent: (id: string) => void;
  onNavigateToSimilarity: (studentAId: string, studentBId: string) => void;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({
  submissions,
  onSelectStudent,
  onNavigateToSimilarity,
}) => {
  const [copied, setCopied] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'similarity' | 'ai'>('score');
  const [sortAsc, setSortAsc] = useState(false);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700">Ведомость пуста</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Загрузите работы студентов, чтобы сформировать автоматическую ведомость с оценками и статусом плагиата.
        </p>
      </div>
    );
  }

  // Sorting
  const sortedSubmissions = [...submissions].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'score') {
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
    csv += 'ФИО Студента,Группа,Файл,Набрано баллов,Всего баллов,Процент,Макс. схожесть,С кем совпадение,Вероятность ИИ,Вердикт ИИ,Статус\n';

    sortedSubmissions.forEach((s) => {
      const status = s.gradePercentage >= 60 ? 'Зачтено' : 'На доработку';
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
      csv += `"${s.studentName}","${s.groupName}","${s.fileName}",${s.totalScore},${s.maxPossibleScore},${s.gradePercentage}%,${simVal},${simWith},${aiProb},"${aiVerdict}","${status}"\n`;
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
    text += `Дата формирования: ${new Date().toLocaleDateString()}\n\n`;
    text += `№ | ФИО Студента | Группа | Балл | % | Плагиат | ИИ-контроль\n`;
    text += `--------------------------------------------------------------------\n`;

    sortedSubmissions.forEach((s, idx) => {
      const sim = s.topSimilarity ? `${s.topSimilarity.similarityPercent}% (${s.topSimilarity.withStudentName})` : '—';
      const ai = s.aiDetection ? `${s.aiDetection.aiProbability}% (${s.aiDetection.verdict})` : '—';
      text += `${idx + 1}. ${s.studentName} | ${s.groupName} | ${s.totalScore}/${s.maxPossibleScore} | ${s.gradePercentage}% | ${sim} | ${ai}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const avgScore =
    submissions.reduce((acc, s) => acc + s.totalScore, 0) / (submissions.length || 1);
  const passedCount = submissions.filter((s) => s.gradePercentage >= 60).length;
  const aiAlertCount = submissions.filter((s) => s.aiDetection?.verdict === 'likely_ai').length;

  return (
    <div className="space-y-5">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Всего студентов</span>
          <span className="text-xl font-bold text-slate-900">{submissions.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Средний балл по группе</span>
          <span className="text-xl font-bold text-indigo-600">
            {Math.round(avgScore * 10) / 10} / {submissions[0]?.maxPossibleScore || LAB1_TASKS.filter((t) => !t.isSample).length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Успешно сдали (&gt;= 60%)</span>
          <span className="text-xl font-bold text-emerald-600">
            {passedCount} ({Math.round((passedCount / submissions.length) * 100)}%)
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Подозрение на ИИ (ChatGPT)</span>
          <span className={`text-xl font-bold ${aiAlertCount > 0 ? 'text-violet-600' : 'text-slate-700'}`}>
            {aiAlertCount} студ.
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Итоговая ведомость группы</h3>
            <p className="text-xs text-slate-500">Автоматически сформированный журнал оценок</p>
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
                <th className="p-3 font-medium">Файл решения</th>
                <th
                  className="p-3 font-medium cursor-pointer hover:text-indigo-600"
                  onClick={() => {
                    setSortBy('score');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Баллы</span>
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
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">
                      <button
                        onClick={() => onSelectStudent(sub.id)}
                        className="hover:text-indigo-600 text-left"
                      >
                        {sub.studentName}
                      </button>
                    </td>
                    <td className="p-3 text-slate-600 font-mono">{sub.groupName}</td>
                    <td className="p-3 text-slate-500 font-mono truncate max-w-[140px]" title={sub.fileName}>
                      {sub.fileName}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
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
                      <div className="flex items-center justify-end gap-2">
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
