import React, { useState } from 'react';
import {
  FileCode2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Info,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UNIVERSAL_LAB_TEMPLATE, downloadUniversalTemplate } from '../data/universalTemplate';

export const TemplateView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(UNIVERSAL_LAB_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadUniversalTemplate('Шаблон_Лабораторная_Работа.py');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                1 файл • Готов к отправке на курс
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                .py скрипт
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Универсальный шаблон для сдачи лабораторных работ
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Скачайте или скопируйте этот файл и прикрепите его в курс для студентов. Студенты просто
              вставляют свой код по номерам, а система автопроверки мгновенно и безошибочно распознаёт
              все их решения без отправки на доработку.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Скопировано в буфер' : 'Скопировать шаблон'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-100"
            >
              {downloadSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {downloadSuccess ? 'Файл скачивается...' : 'Скачать шаблон (.py)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations & Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs mb-3">
            1
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">
            Структура по разделам (1.1, 2.3...)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Задания сгруппированы по разделам с точечной нумерацией (<code className="px-1 py-0.5 bg-slate-100 rounded text-slate-800"># 1.1</code>, <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-800"># 2.3</code>). Если в разделе меньше или больше задач — номера легко удалить или дописать по аналогии.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs mb-3">
            2
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">
            Без лишнего шума и слова «задание»
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Убраны громоздкие рамки и лишние слова. Только чистые маркеры задач. Парсер считывает их со 100% точностью и не путает с выводами <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-800">print()</code>.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs mb-3">
            3
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">
            Студент, группа и номер работы
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Лаконичная шапка без даты и варианта. Автогрейдер сразу считывает фамилию студента и группу и выносит их в итоговую сводную таблицу.
          </p>
        </div>
      </div>

      {/* Code Preview Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-900 font-mono">
              Шаблон_Лабораторная_Работа.py
            </span>
            <span className="text-[11px] text-slate-400">
              (текст шаблона для студентов)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 text-slate-100 overflow-x-auto max-h-[600px] text-xs font-mono leading-relaxed select-text">
          <pre>{UNIVERSAL_LAB_TEMPLATE}</pre>
        </div>
      </div>

      {/* Quick memo for teacher */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 space-y-1">
          <p className="font-semibold">
            Как использовать этот шаблон в вашем курсе (Moodle, Blackboard, Telegram, Google Диск):
          </p>
          <ol className="list-decimal list-inside space-y-0.5 text-indigo-900/90 leading-relaxed">
            <li>Нажмите <strong>«Скачать шаблон (.py)»</strong> и прикрепите файл к описанию лабораторной работы или задания на курсе.</li>
            <li>Напишите студентам: <em>«Сдавать работу строго в данном файле-шаблоне. Вставляйте код ваших решений под номерами разделов и пунктов (# 1.1, # 2.1...)»</em>.</li>
            <li>Когда студенты пришлют решения, просто перетащите полученные файлы или архив сюда — система проверит все задания без ошибок форматирования!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
