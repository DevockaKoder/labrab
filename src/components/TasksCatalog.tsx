import React, { useState } from 'react';
import { LAB1_TASKS } from '../data/lab1Tasks';
import { LAB2_TASKS } from '../data/lab2Tasks';
import { LAB3_TASKS } from '../data/lab3Tasks';
import { LAB4_TASKS } from '../data/lab4Tasks';
import { LAB5_TASKS } from '../data/lab5Tasks';
import { BookOpen, Copy, Check, Terminal, Code2, Download, FileCode2 } from 'lucide-react';
import { downloadUniversalTemplate } from '../data/universalTemplate';

interface TasksCatalogProps {
  initialLab?: 'lab1' | 'lab2' | 'lab3' | 'lab4' | 'lab5';
}

export const TasksCatalog: React.FC<TasksCatalogProps> = ({ initialLab = 'lab1' }) => {
  const [activeLab, setActiveLab] = useState<'lab1' | 'lab2' | 'lab3' | 'lab4' | 'lab5'>(initialLab);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [copiedTask, setCopiedTask] = useState<string | null>(null);

  const lab1Sections = [
    'all',
    'I. Линейный алгоритм',
    'II. Условный алгоритм. Конструкция if',
    'III. Цикл с параметром (For)',
    'IV. Цикл с условием (While)',
  ];

  const lab2Sections = [
    'all',
    'I. Числа, целые и вещественные',
    'II. Проверка условия (if-elif-else, логические выражения)',
  ];

  const lab3Sections = [
    'all',
    '1. Цикл с параметром: группа For',
    '2. Цикл с условием: группа While',
    '3. Однопроходные алгоритмы цикла while',
    '4. Вложенные циклы while',
  ];

  const lab4Sections = [
    'all',
    '1. Базовые операции со строками',
    '2. Индексация и срезы строк',
    '3. Посимвольный анализ и преобразование строк',
  ];

  const lab5Sections = [
    'all',
    '1. Обработка строк с помощью методов',
    '2. Анализ и преобразование слов в строке',
    '3. Другие задания на обработку строк',
  ];

  const currentLabTasks =
    activeLab === 'lab5'
      ? LAB5_TASKS
      : activeLab === 'lab4'
      ? LAB4_TASKS
      : activeLab === 'lab3'
      ? LAB3_TASKS
      : activeLab === 'lab2'
      ? LAB2_TASKS
      : LAB1_TASKS;

  const currentSections =
    activeLab === 'lab5'
      ? lab5Sections
      : activeLab === 'lab4'
      ? lab4Sections
      : activeLab === 'lab3'
      ? lab3Sections
      : activeLab === 'lab2'
      ? lab2Sections
      : lab1Sections;

  const filteredTasks = currentLabTasks.filter(
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
      {/* Lab Switcher & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                {activeLab === 'lab5'
                  ? 'База заданий: Лабораторная работа №5'
                  : activeLab === 'lab4'
                  ? 'База заданий: Лабораторная работа №4'
                  : activeLab === 'lab3'
                  ? 'База заданий: Лабораторная работа №3'
                  : activeLab === 'lab2'
                  ? 'База заданий: Лабораторная работа №2'
                  : 'База заданий: Лабораторная работа №1'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {activeLab === 'lab5'
                ? '«Базовые типы данных – строки: Методы строк» • 23 основные задачи (без доп.)'
                : activeLab === 'lab4'
                ? '«Базовые типы данных – строки: индексация, срезы, ord/chr, посимвольный анализ» • 25 основных заданий (без доп.)'
                : activeLab === 'lab3'
                ? '«Циклы for и while, однопроходные алгоритмы без списков, вложенные циклы» • 20 основных заданий'
                : activeLab === 'lab2'
                ? '«Числовые типы данных, целочисленная арифметика и оператор выбора» • 25 обязательных заданий'
                : '«Введение в Python. Интегрированная среда разработки IDLE» • 23 задания с эталонными решениями'}
            </p>
          </div>

          {/* Lab Selector Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80">
            <button
              onClick={() => {
                setActiveLab('lab1');
                setSelectedSection('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLab === 'lab1'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Лаб №1 (23)
            </button>
            <button
              onClick={() => {
                setActiveLab('lab2');
                setSelectedSection('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLab === 'lab2'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Лаб №2 (25)
            </button>
            <button
              onClick={() => {
                setActiveLab('lab3');
                setSelectedSection('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLab === 'lab3'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Лаб №3 (20)
            </button>
            <button
              onClick={() => {
                setActiveLab('lab4');
                setSelectedSection('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLab === 'lab4'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Лаб №4 (25)
            </button>
            <button
              onClick={() => {
                setActiveLab('lab5');
                setSelectedSection('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLab === 'lab5'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Лаб №5 (23)
            </button>
          </div>

          {/* Quick template button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadUniversalTemplate('Шаблон_Лабораторная_Работа.py')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
              title="Скачать универсальный .py шаблон для отправки студентам"
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Скачать шаблон для студентов (.py)</span>
            </button>
          </div>
        </div>

        {/* Section filter */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {currentSections.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSection(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedSection === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all'
                ? `Все задания (${currentLabTasks.length})`
                : s.split('.')[0] + '.' + s.split('.')[1]?.slice(0, 22)}
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
                {task.isSample ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                    Пример (не оценивается)
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Зачётное (1 балл)
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

            {/* Test cases summary */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="flex items-center gap-1 font-medium">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  Тесты ({task.testCases.length})
                </span>
                {task.sampleCode && (
                  <button
                    onClick={() => handleCopyCode(task.id, task.sampleCode)}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {copiedTask === task.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Эталон</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {task.testCases.map((tc) => (
                  <div
                    key={tc.id}
                    className="text-[11px] bg-slate-50 px-2 py-1 rounded text-slate-600 flex items-center justify-between"
                  >
                    <span className="truncate">{tc.description}</span>
                    <span className="font-mono text-slate-500 text-[10px] ml-2 flex-shrink-0">
                      → {tc.expectedValueDescription}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
