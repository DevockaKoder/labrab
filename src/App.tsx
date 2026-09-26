import React, { useState, useEffect } from 'react';
import { StudentSubmission, SimilarityPair } from './types';
import { Header } from './components/Header';
import { StudentGradingView } from './components/StudentGradingView';
import { SimilarityMatrixView } from './components/SimilarityMatrixView';
import { SummaryTable } from './components/SummaryTable';
import { TasksCatalog } from './components/TasksCatalog';
import { UploadModal } from './components/UploadModal';
import { gradeStudentCode } from './utils/grader';
import { detectLabType } from './utils/codeParser';
import { compareAllSubmissions } from './utils/similarityEngine';
import { getPyodide } from './utils/pythonRunner';
import { SAMPLE_SUBMISSIONS } from './data/sampleSubmissions';
import { SAMPLE_SUBMISSIONS_LAB2 } from './data/sampleSubmissionsLab2';
import { Upload, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'grading' | 'similarity' | 'summary' | 'tasks'>('grading');
  const [activeLab, setActiveLab] = useState<'lab1' | 'lab2'>('lab1');
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [similarityPairs, setSimilarityPairs] = useState<SimilarityPair[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [diffStudentPair, setDiffStudentPair] = useState<{ studentAId: string; studentBId: string }>({
    studentAId: '',
    studentBId: '',
  });

  // Initialize Pyodide on startup
  useEffect(() => {
    getPyodide()
      .then(() => setIsPyodideReady(true))
      .catch((err) => {
        console.warn('Pyodide initialization pending or fallback:', err);
      });
  }, []);

  // Filter submissions by currently active lab
  const currentLabSubmissions = submissions.filter((s) => (s.labId || 'lab1') === activeLab);

  // Recalculate similarity pairs for current lab
  const currentSimilarityPairs = similarityPairs.filter((pair) => {
    const studentA = submissions.find((s) => s.id === pair.studentAId);
    return studentA && (studentA.labId || 'lab1') === activeLab;
  });

  // Ensure selected student belongs to currently active lab
  useEffect(() => {
    if (currentLabSubmissions.length > 0) {
      const exists = currentLabSubmissions.some((s) => s.id === selectedStudentId);
      if (!exists) {
        setSelectedStudentId(currentLabSubmissions[0].id);
      }
    } else {
      setSelectedStudentId('');
    }
  }, [activeLab, submissions]);

  // Handler to process uploaded files
  const handleProcessFiles = async (
    files: { name: string; content: string }[],
    targetLab?: 'lab1' | 'lab2'
  ) => {
    setIsProcessing(true);
    const newSubmissions: StudentSubmission[] = [];
    let detectedOrChosenLab: 'lab1' | 'lab2' = targetLab || activeLab;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const specificLab = targetLab || detectLabType(file.content, file.name, activeLab);
      detectedOrChosenLab = specificLab;
      setProgressText(`Проверка файла ${i + 1} из ${files.length}: ${file.name} (Лаб №${specificLab === 'lab2' ? 2 : 1})`);

      try {
        const graded = await gradeStudentCode(
          file.content,
          file.name,
          (tIdx, total) => {
            setProgressText(`Файл ${i + 1}/${files.length} (${file.name}): тест ${tIdx}/${total}`);
          },
          specificLab
        );
        newSubmissions.push(graded);
      } catch (err: any) {
        console.error('Ошибка проверки файла:', file.name, err);
      }
    }

    // Combine with existing submissions
    const combined = [...submissions, ...newSubmissions];
    const pairs = compareAllSubmissions(combined);

    setSubmissions([...combined]);
    setSimilarityPairs(pairs);

    // Switch to the lab of uploaded submissions
    setActiveLab(detectedOrChosenLab);
    if (newSubmissions.length > 0) {
      setSelectedStudentId(newSubmissions[0].id);
    }

    setIsProcessing(false);
    setProgressText('');
  };

  const handleQuickLoadDemo = async (lab: 'lab1' | 'lab2') => {
    const samples = lab === 'lab2' ? SAMPLE_SUBMISSIONS_LAB2 : SAMPLE_SUBMISSIONS;
    const files = samples.map((s) => ({
      name: s.fileName,
      content: s.code,
    }));
    await handleProcessFiles(files, lab);
  };

  const handleNavigateToSimilarity = (studentAId: string, studentBId: string) => {
    setDiffStudentPair({ studentAId, studentBId });
    setActiveTab('similarity');
  };

  const handleDeleteSubmission = (id: string) => {
    const updated = submissions.filter((s) => s.id !== id);
    const pairs = compareAllSubmissions(updated);
    setSubmissions(updated);
    setSimilarityPairs(pairs);
    if (selectedStudentId === id) {
      const remainingForLab = updated.filter((s) => (s.labId || 'lab1') === activeLab);
      setSelectedStudentId(remainingForLab[0]?.id || '');
    }
  };

  const suspiciousCount = currentSimilarityPairs.filter((p) => p.riskLevel === 'high').length;
  const aiAlertCount = currentLabSubmissions.filter((s) => s.aiDetection?.verdict === 'likely_ai').length;

  const handleUpdateSubmission = (updated: StudentSubmission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleToggleArchive = (studentId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const nextArchived = !s.isArchived;
          return {
            ...s,
            isArchived: nextArchived,
            feedbackSent: nextArchived ? true : s.feedbackSent,
            archivedAt: nextArchived
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header with Lab Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeLab={activeLab}
        onSelectLab={(lab) => {
          setActiveLab(lab);
        }}
        submissionsCount={currentLabSubmissions.length}
        suspiciousCount={suspiciousCount}
        aiAlertCount={aiAlertCount}
        isPyodideReady={isPyodideReady}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'grading' && (
          currentLabSubmissions.length > 0 ? (
            <StudentGradingView
              submissions={currentLabSubmissions}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
              onNavigateToSimilarity={handleNavigateToSimilarity}
              onDeleteSubmission={handleDeleteSubmission}
              onUpdateSubmission={handleUpdateSubmission}
              onToggleArchive={handleToggleArchive}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeLab === 'lab2'
                  ? 'Работы по Лабораторной работе №2 ещё не загружены'
                  : 'Работы по Лабораторной работе №1 ещё не загружены'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
                {activeLab === 'lab2'
                  ? 'В этой лабораторной проверяются 25 обязательных заданий (числовые типы данных, деление // и %, время, робот, локатор). Загрузите работы студентов или мгновенно проверьте демо-примеры.'
                  : 'В этой лабораторной проверяются 23 задания (18 зачётных + 5 образцов). Загрузите работы студентов или откройте демо-примеры.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-100"
                >
                  <Upload className="w-4 h-4" />
                  <span>Загрузить файлы студентов (.py / .zip)</span>
                </button>
                <button
                  onClick={() => handleQuickLoadDemo(activeLab)}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Загрузить демо-работы ({activeLab === 'lab2' ? 'Лаб №2: 25 зад.' : 'Лаб №1'})</span>
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'similarity' && (
          <SimilarityMatrixView
            submissions={currentLabSubmissions}
            similarityPairs={currentSimilarityPairs}
            initialStudentAId={diffStudentPair.studentAId}
            initialStudentBId={diffStudentPair.studentBId}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryTable
            submissions={currentLabSubmissions}
            onSelectStudent={(id) => {
              setSelectedStudentId(id);
              setActiveTab('grading');
            }}
            onNavigateToSimilarity={handleNavigateToSimilarity}
            onToggleArchive={handleToggleArchive}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'tasks' && <TasksCatalog initialLab={activeLab} />}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onProcessFiles={handleProcessFiles}
        isProcessing={isProcessing}
        progressText={progressText}
        currentActiveLab={activeLab}
      />
    </div>
  );
}
