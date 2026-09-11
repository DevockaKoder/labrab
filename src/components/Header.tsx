import React from 'react';
import { PlayCircle, ShieldAlert, FileSpreadsheet, BookOpen, Upload, CheckCircle2, Loader2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'grading' | 'similarity' | 'summary' | 'tasks';
  setActiveTab: (tab: 'grading' | 'similarity' | 'summary' | 'tasks') => void;
  submissionsCount: number;
  suspiciousCount: number;
  aiAlertCount?: number;
  isPyodideReady: boolean;
  onOpenUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  submissionsCount,
  suspiciousCount,
  aiAlertCount = 0,
  isPyodideReady,
  onOpenUpload,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              <span className="text-xl font-mono">Py</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Проверка Лабораторной №1 по Python
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  IDLE / 23 задачи
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Автотестирование вывода, AST-проверки ограничений и антиплагиат
              </p>
            </div>
          </div>

          {/* Quick status & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Pyodide Runtime Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isPyodideReady
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
              }`}
            >
              {isPyodideReady ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Python Wasm готов</span>
                </>
              ) : (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>Загрузка Python...</span>
                </>
              )}
            </div>

            {/* Upload Button */}
            <button
              id="upload-submission-btn"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Загрузить работы (.py / .zip)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 border-t border-slate-100 pt-1 -mb-px overflow-x-auto scrollbar-none">
          <button
            id="tab-grading"
            onClick={() => setActiveTab('grading')}
            className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'grading'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Проверка решений</span>
            {submissionsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-slate-100 text-slate-600">
                {submissionsCount}
              </span>
            )}
            {aiAlertCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700 border border-violet-200">
                {aiAlertCount} ИИ
              </span>
            )}
          </button>

          <button
            id="tab-similarity"
            onClick={() => setActiveTab('similarity')}
            className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'similarity'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Антиплагиат и схожесть</span>
            {suspiciousCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-rose-100 text-rose-700 font-semibold animate-pulse">
                {suspiciousCount} совп.
              </span>
            )}
          </button>

          <button
            id="tab-summary"
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'summary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Сводная ведомость</span>
          </button>

          <button
            id="tab-tasks"
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>База задач методички (23)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
