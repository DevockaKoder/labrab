import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { X, UploadCloud, FileCode, CheckCircle2, AlertCircle, FileArchive } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessFiles: (files: { name: string; content: string }[]) => Promise<void>;
  isProcessing: boolean;
  progressText: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onProcessFiles,
  isProcessing,
  progressText,
}) => {
  const [activeMode, setActiveMode] = useState<'files' | 'paste'>('files');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; content: string }[]>([]);
  const [pasteName, setPasteName] = useState('');
  const [pasteGroup, setPasteGroup] = useState('ТРП-1-22');
  const [pasteCode, setPasteCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setErrorMsg('');
    const files = Array.from(e.dataTransfer.files) as File[];
    await processRawFiles(files);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setErrorMsg('');
    const files = Array.from(e.target.files) as File[];
    await processRawFiles(files);
  };

  const processRawFiles = async (files: File[]) => {
    const parsedFiles: { name: string; content: string }[] = [];

    for (const file of files) {
      if (file.name.endsWith('.py')) {
        const text = await file.text();
        parsedFiles.push({ name: file.name, content: text });
      } else if (file.name.endsWith('.zip')) {
        try {
          const zip = new JSZip();
          const zipData = await zip.loadAsync(file);
          for (const [filename, fileObj] of Object.entries(zipData.files)) {
            if (!fileObj.dir && filename.endsWith('.py')) {
              const text = await fileObj.async('text');
              const cleanName = filename.split('/').pop() || filename;
              parsedFiles.push({ name: cleanName, content: text });
            }
          }
        } catch (err: any) {
          setErrorMsg(`Ошибка распаковки архива ${file.name}: ${err.message}`);
        }
      }
    }

    if (parsedFiles.length === 0) {
      setErrorMsg('Не найдено ни одного файла .py или .zip с питоновскими скриптами');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...parsedFiles]);
  };

  const handleStartGrading = async () => {
    if (activeMode === 'files') {
      if (selectedFiles.length === 0) {
        setErrorMsg('Выберите хотя бы один файл');
        return;
      }
      await onProcessFiles(selectedFiles);
    } else {
      if (!pasteCode.trim()) {
        setErrorMsg('Вставьте код решения');
        return;
      }
      const studentTag = `# ${pasteGroup}, ${pasteName || 'Студент'}\n`;
      const fullCode = studentTag + pasteCode;
      const fileName = `${pasteName || 'Решение'}_Практика1.py`;
      await onProcessFiles([{ name: fileName, content: fullCode }]);
    }
    setSelectedFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Загрузка студенческих работ</h2>
            <p className="text-xs text-slate-500">
              Поддерживаются файлы .py, ZIP-архивы с работами всей группы или вставка кода
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl mt-4 mb-4">
          <button
            type="button"
            onClick={() => setActiveMode('files')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeMode === 'files' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Файлы (.py / .zip)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('paste')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeMode === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Вставить код вручную
          </button>
        </div>

        {activeMode === 'files' ? (
          <div>
            {/* Drop area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".py,.zip"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-800">
                Перетащите сюда файлы .py или архив .zip
              </p>
              <p className="text-xs text-slate-500 mt-1">
                или кликните для выбора с компьютера
              </p>
            </div>

            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-medium">
                  <span>Готово к проверке: {selectedFiles.length} файл(ов)</span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-rose-600 hover:underline"
                  >
                    Очистить
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-lg p-2 bg-slate-50">
                  {selectedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-md border border-slate-200/80"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {f.name.endsWith('.zip') ? (
                          <FileArchive className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        ) : (
                          <FileCode className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        )}
                        <span className="truncate text-slate-700 font-mono">{f.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {Math.round(f.content.length / 1024 * 10) / 10} КБ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ФИО студента
                </label>
                <input
                  type="text"
                  placeholder="Иванов И.И."
                  value={pasteName}
                  onChange={(e) => setPasteName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Группа
                </label>
                <input
                  type="text"
                  placeholder="ТРП-1-22"
                  value={pasteGroup}
                  onChange={(e) => setPasteGroup(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Исходный код Python
              </label>
              <textarea
                rows={8}
                placeholder="# 1.1&#10;x = int(input())&#10;print(7 * x + 5)&#10;&#10;# 1.2&#10;..."
                value={pasteCode}
                onChange={(e) => setPasteCode(e.target.value)}
                className="w-full font-mono text-xs p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-900 text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900">
            <div className="flex items-center gap-2 text-xs font-medium mb-1">
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>{progressText || 'Идет тестирование решений и проверка плагиата...'}</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            id="start-grading-btn"
            onClick={handleStartGrading}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isProcessing ? 'Проверяется...' : 'Запустить автопроверку'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
