import React, { useState } from 'react';
import { StudentSubmission, SimilarityPair } from '../types';
import { LAB1_TASKS } from '../data/lab1Tasks';
import { calculateCodeSimilarity } from '../utils/similarityEngine';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  GitCompare,
  ArrowRight,
  Filter,
  Check,
  Search,
  Code,
  Upload,
} from 'lucide-react';

interface SimilarityMatrixViewProps {
  submissions: StudentSubmission[];
  similarityPairs: SimilarityPair[];
  initialStudentAId?: string;
  initialStudentBId?: string;
  onOpenUpload?: () => void;
}

export const SimilarityMatrixView: React.FC<SimilarityMatrixViewProps> = ({
  submissions,
  similarityPairs,
  initialStudentAId,
  initialStudentBId,
  onOpenUpload,
}) => {
  const [selectedStudentA, setSelectedStudentA] = useState<string>(
    initialStudentAId || (submissions[0]?.id || '')
  );
  const [selectedStudentB, setSelectedStudentB] = useState<string>(
    initialStudentBId || (submissions[1]?.id || '')
  );
  const [selectedTaskFilter, setSelectedTaskFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (submissions.length < 2) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <GitCompare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Недостаточно работ для сравнения</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
          Для анализа схожести и взаимного плагиата необходимо загрузить как минимум 2 работы студентов (.py / .zip). Алгоритм сравнивает нормализованную структуру AST и токенов независимо от переименования переменных.
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

  // Filter pairs
  const filteredPairs = similarityPairs.filter((p) => {
    if (riskFilter === 'high' && p.riskLevel !== 'high') return false;
    if (riskFilter === 'medium' && p.riskLevel !== 'medium' && p.riskLevel !== 'high') return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.studentAName.toLowerCase().includes(term) ||
        p.studentBName.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const studentA = submissions.find((s) => s.id === selectedStudentA) || submissions[0];
  const studentB = submissions.find((s) => s.id === selectedStudentB) || submissions[1];

  const currentPairSim = studentA && studentB
    ? calculateCodeSimilarity(
        selectedTaskFilter === 'all'
          ? studentA.rawCode
          : studentA.tasks[selectedTaskFilter] || '',
        selectedTaskFilter === 'all'
          ? studentB.rawCode
          : studentB.tasks[selectedTaskFilter] || ''
      )
    : { similarityPercent: 0, tokenSimilarity: 0, structuralSimilarity: 0 };

  const codeA =
    selectedTaskFilter === 'all'
      ? studentA.rawCode
      : studentA.tasks[selectedTaskFilter] || '# Задача не решена студентом';
  const codeB =
    selectedTaskFilter === 'all'
      ? studentB.rawCode
      : studentB.tasks[selectedTaskFilter] || '# Задача не решена студентом';

  const highRiskCount = similarityPairs.filter((p) => p.riskLevel === 'high').length;
  const mediumRiskCount = similarityPairs.filter((p) => p.riskLevel === 'medium').length;

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Высокий риск (&gt; 70%)</span>
            <span className="text-xl font-bold text-rose-600">{highRiskCount} пары</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Умеренная схожесть (45–70%)</span>
            <span className="text-xl font-bold text-amber-600">{mediumRiskCount} пары</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Проверено пар работ</span>
            <span className="text-xl font-bold text-slate-800">{similarityPairs.length}</span>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ranked Pairs List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Рейтинг схожести пар ({filteredPairs.length})
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  riskFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setRiskFilter('high')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  riskFilter === 'high'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                &gt;70%
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по фамилии студента..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredPairs.map((pair, idx) => {
              const isSelected =
                (pair.studentAId === selectedStudentA && pair.studentBId === selectedStudentB) ||
                (pair.studentAId === selectedStudentB && pair.studentBId === selectedStudentA);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedStudentA(pair.studentAId);
                    setSelectedStudentB(pair.studentBId);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      <span>{pair.studentAName}</span>
                      <span className="text-slate-400 mx-1.5">↔</span>
                      <span>{pair.studentBName}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        pair.riskLevel === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : pair.riskLevel === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {pair.overallSimilarityPercent}%
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>
                      Токены: <strong>{pair.taskSimilarities[0]?.tokenSimilarity || pair.overallSimilarityPercent}%</strong>
                    </span>
                    <span>
                      Структура: <strong>{pair.taskSimilarities[0]?.structuralSimilarity || pair.overallSimilarityPercent}%</strong>
                    </span>
                    <span className="text-indigo-600 font-medium inline-flex items-center gap-0.5">
                      Сравнить <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Heatmap Table Matrix */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Матрица взаимной схожести (Heatmap)
              </h3>
              <p className="text-xs text-slate-500">
                Кликните по любой ячейке для моментального сравнения двух работ
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300" />
                &lt;40%
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-200 border border-amber-400" />
                40-70%
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-rose-400" />
                &gt;70%
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left font-medium text-slate-400 bg-slate-50/50"></th>
                  {submissions.map((s, idx) => (
                    <th
                      key={idx}
                      className="p-2 font-semibold text-slate-700 bg-slate-50 truncate max-w-[90px]"
                      title={s.studentName}
                    >
                      {s.studentName.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((rowSub, rIdx) => (
                  <tr key={rIdx}>
                    <td
                      className="p-2 text-left font-semibold text-slate-700 bg-slate-50 truncate max-w-[110px]"
                      title={rowSub.studentName}
                    >
                      {rowSub.studentName}
                    </td>
                    {submissions.map((colSub, cIdx) => {
                      if (rowSub.id === colSub.id) {
                        return (
                          <td key={cIdx} className="p-2 text-slate-300 bg-slate-50 font-mono text-[11px]">
                            —
                          </td>
                        );
                      }

                      // Find pair
                      const pair = similarityPairs.find(
                        (p) =>
                          (p.studentAId === rowSub.id && p.studentBId === colSub.id) ||
                          (p.studentAId === colSub.id && p.studentBId === rowSub.id)
                      );
                      const percent = pair ? pair.overallSimilarityPercent : 0;
                      const isHigh = percent >= 70;
                      const isMed = percent >= 45;

                      const isSelectedCell =
                        (rowSub.id === selectedStudentA && colSub.id === selectedStudentB) ||
                        (rowSub.id === selectedStudentB && colSub.id === selectedStudentA);

                      return (
                        <td
                          key={cIdx}
                          onClick={() => {
                            setSelectedStudentA(rowSub.id);
                            setSelectedStudentB(colSub.id);
                          }}
                          className={`p-2 font-mono font-bold text-xs cursor-pointer transition-all ${
                            isSelectedCell
                              ? 'ring-2 ring-indigo-600 scale-105 z-10 rounded-md'
                              : ''
                          } ${
                            isHigh
                              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              : isMed
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          {percent}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side-by-Side Diff Comparison Inspector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Построчное визуальное сравнение решений
              </h3>
              <p className="text-xs text-slate-500">
                Сравнение оригинального и нормализованного кода для выявления списанных фрагментов
              </p>
            </div>
          </div>

          {/* Task selector for diff */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Сравнить:</span>
            <select
              value={selectedTaskFilter}
              onChange={(e) => setSelectedTaskFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Весь файл целиком</option>
              {LAB1_TASKS.map((t) => (
                <option key={t.id} value={t.id}>
                  Задача {t.id} ({t.title})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Header with % Similarity */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                currentPairSim.similarityPercent >= 70
                  ? 'bg-rose-100 text-rose-700'
                  : currentPairSim.similarityPercent >= 45
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {currentPairSim.similarityPercent}%
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">
                {currentPairSim.similarityPercent >= 70
                  ? 'Высокая степень плагиата (код идентичен по структуре)'
                  : currentPairSim.similarityPercent >= 45
                  ? 'Умеренное сходство алгоритма'
                  : 'Работы существенно различаются (оригинальный код)'}
              </h4>
              <p className="text-[11px] text-slate-500">
                Схожесть токенов: <strong>{currentPairSim.tokenSimilarity}%</strong> (инвариантно к переименованию переменных) • Структура AST: <strong>{currentPairSim.structuralSimilarity}%</strong>
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            {selectedTaskFilter === 'all'
              ? 'Анализируются все строки файлов'
              : `Анализируется блок задачи ${selectedTaskFilter}`}
          </div>
        </div>

        {/* Side-by-side code blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column A */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                Студент А: {studentA.studentName} ({studentA.groupName})
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                {studentA.fileName}
              </span>
            </div>
            <div className="bg-slate-900 p-3.5 text-xs font-mono text-emerald-400 max-h-96 overflow-y-auto overflow-x-auto leading-relaxed">
              <pre>{codeA}</pre>
            </div>
          </div>

          {/* Column B */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                Студент Б: {studentB.studentName} ({studentB.groupName})
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                {studentB.fileName}
              </span>
            </div>
            <div className="bg-slate-900 p-3.5 text-xs font-mono text-emerald-400 max-h-96 overflow-y-auto overflow-x-auto leading-relaxed">
              <pre>{codeB}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
