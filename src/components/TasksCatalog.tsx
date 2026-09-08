import React, { useState } from 'react';
import { LAB1_TASKS } from '../data/lab1Tasks';
import { BookOpen, Copy, Check, Terminal, Code2 } from 'lucide-react';

export const TasksCatalog: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [copiedTask, setCopiedTask] = useState<string | null>(null);

  const sections = [
    'all',
    'I. Линейный алгоритм',
    'II. Условный алгоритм. Конструкция if',
    'III. Цикл с параметром (For)',
    'IV. Цикл с условием (While)',
  ];

  const filteredTasks = LAB1_TASKS.filter(
    (t) => selectedSection === 'all' || t.section === selectedSection
  );

  const handleCopyCode = (id: string, code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedTask(id);
    setTimeout(() => setCopiedTask(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              База заданий Лабораторной работы №1
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            «Введение в Python. Интегрированная среда разработки IDLE» • 23 задания с эталонными решениями и тестами
          </p>
        </div>

        {/* Section filter */}
        <div className="flex flex-wrap gap-1.5">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSection(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedSection === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'Все задания (23)' : s.split('.')[0] + '.' + s.split('.')[1]?.slice(0, 15)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center border border-indigo-200/60">
                    {task.id}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
                </div>
                {task.isSample && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Образец
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-400 block mb-1.5">{task.section}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{task.condition}</p>

              {task.formulaDescription && (
                <div className="mt-2 text-indigo-700 font-mono text-[11px] bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                  {task.formulaDescription}
                </div>
              )}

              {task.astRules && task.astRules.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {task.astRules.map((rule, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      {rule.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sample solution snippet */}
            {task.sampleCode && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Terminal className="w-3 h-3" />
                    Эталонный код:
                  </span>
                  <button
                    onClick={() => handleCopyCode(task.id, task.sampleCode)}
                    className="hover:text-indigo-600 flex items-center gap-1"
                  >
                    {copiedTask === task.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Копировать</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-xs font-mono overflow-x-auto max-h-32">
                  {task.sampleCode}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
