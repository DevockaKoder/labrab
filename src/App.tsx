import React, { useState, useEffect } from 'react';
import { StudentSubmission, SimilarityPair } from './types';
import { Header } from './components/Header';
import { StudentGradingView } from './components/StudentGradingView';
import { SimilarityMatrixView } from './components/SimilarityMatrixView';
import { SummaryTable } from './components/SummaryTable';
import { TasksCatalog } from './components/TasksCatalog';
import { TemplateView } from './components/TemplateView';
import { UploadModal } from './components/UploadModal';
import { gradeStudentCode } from './utils/grader';
import { detectLabType } from './utils/codeParser';
import { compareAllSubmissions } from './utils/similarityEngine';
import { getPyodide } from './utils/pythonRunner';
import { SAMPLE_SUBMISSIONS } from './data/sampleSubmissions';
import { SAMPLE_SUBMISSIONS_LAB2 } from './data/sampleSubmissionsLab2';
import { SAMPLE_SUBMISSIONS_LAB3 } from './data/sampleSubmissionsLab3';
import { SAMPLE_SUBMISSIONS_LAB4 } from './data/sampleSubmissionsLab4';
import { SAMPLE_SUBMISSIONS_LAB5 } from './data/sampleSubmissionsLab5';
import { useAuth } from './context/AuthContext';
import {
  saveSingleSubmission,
  saveSubmissionsBatch,
  deleteSubmissionFromCloud,
  subscribeToSubmissions,
} from './utils/firebaseStorage';
import {
  Upload,
  Sparkles,
  Layers,
  Cloud,
  LogIn,
  X,
  CloudUpload,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const { user, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'grading' | 'similarity' | 'summary' | 'tasks' | 'template'>('grading');
  const [activeLab, setActiveLab] = useState<'lab1' | 'lab2' | 'lab3' | 'lab4' | 'lab5'>('lab1');
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [similarityPairs, setSimilarityPairs] = useState<SimilarityPair[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showSyncBanner, setShowSyncBanner] = useState<boolean>(true);
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

  // Subscribe to Firestore submissions when teacher is logged in
  useEffect(() => {
    if (!user) return;

    setIsSyncing(true);
    const unsubscribe = subscribeToSubmissions(
      user.uid,
      (remoteSubs) => {
        setIsSyncing(false);
        setSubmissions((prevLocal) => {
          // If remote is empty and we had local submissions, don't wipe them immediately
          if (remoteSubs.length === 0 && prevLocal.length > 0) {
            return prevLocal;
          }
          const remoteIds = new Set(remoteSubs.map((s) => s.id));
          const unsynced = prevLocal.filter((local) => !remoteIds.has(local.id));
          return [...remoteSubs, ...unsynced];
        });
      },
      (err) => {
        setIsSyncing(false);
        console.error('Firestore subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Recalculate similarity pairs whenever submissions change
  useEffect(() => {
    if (submissions.length > 0) {
      const pairs = compareAllSubmissions(submissions);
      setSimilarityPairs(pairs);
    } else {
      setSimilarityPairs([]);
    }
  }, [submissions]);

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
  }, [activeLab, currentLabSubmissions, selectedStudentId]);

  // Handler to process uploaded files
  const handleProcessFiles = async (
    files: { name: string; content: string }[],
    targetLab?: 'lab1' | 'lab2' | 'lab3' | 'lab4' | 'lab5'
  ) => {
    setIsProcessing(true);
    const newSubmissions: StudentSubmission[] = [];
    let detectedOrChosenLab: 'lab1' | 'lab2' | 'lab3' | 'lab4' | 'lab5' = targetLab || activeLab;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const specificLab = targetLab || detectLabType(file.content, file.name, activeLab);
      detectedOrChosenLab = specificLab;
      const labNum = specificLab === 'lab5' ? 5 : specificLab === 'lab4' ? 4 : specificLab === 'lab3' ? 3 : specificLab === 'lab2' ? 2 : 1;
      setProgressText(`Проверка файла ${i + 1} из ${files.length}: ${file.name} (Лаб №${labNum})`);

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

    setProgressText('Проверка схожести решений (антиплагиат)...');
    await new Promise((resolve) => setTimeout(resolve, 15));

    const combined = [...submissions, ...newSubmissions];
    setSubmissions(combined);

    // If teacher is logged in, automatically save new submissions to Firestore
    if (user && newSubmissions.length > 0) {
      setIsSyncing(true);
      saveSubmissionsBatch(newSubmissions, user.uid)
        .catch((err) => console.error('Cloud batch save failed:', err))
        .finally(() => setIsSyncing(false));
    }

    // Switch to the lab of uploaded submissions
    setActiveLab(detectedOrChosenLab);
    if (newSubmissions.length > 0) {
      setSelectedStudentId(newSubmissions[0].id);
    }

    setIsProcessing(false);
    setProgressText('');
  };

  const handleQuickLoadDemo = async (lab: 'lab1' | 'lab2' | 'lab3' | 'lab4' | 'lab5') => {
    const samples =
      lab === 'lab5'
        ? SAMPLE_SUBMISSIONS_LAB5
        : lab === 'lab4'
        ? SAMPLE_SUBMISSIONS_LAB4
        : lab === 'lab3'
        ? SAMPLE_SUBMISSIONS_LAB3
        : lab === 'lab2'
        ? SAMPLE_SUBMISSIONS_LAB2
        : SAMPLE_SUBMISSIONS;
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
    setSubmissions(updated);

    if (user) {
      setIsSyncing(true);
      deleteSubmissionFromCloud(id)
        .catch((err) => console.error('Cloud delete error:', err))
        .finally(() => setIsSyncing(false));
    }

    if (selectedStudentId === id) {
      const remainingForLab = updated.filter((s) => (s.labId || 'lab1') === activeLab);
      setSelectedStudentId(remainingForLab[0]?.id || '');
    }
  };

  const handleUpdateSubmission = (updated: StudentSubmission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (user) {
      setIsSyncing(true);
      saveSingleSubmission(updated, user.uid)
        .catch((err) => console.error('Cloud update error:', err))
        .finally(() => setIsSyncing(false));
    }
  };

  const handleToggleArchive = (studentId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const nextArchived = !s.isArchived;
          const updatedSub: StudentSubmission = {
            ...s,
            isArchived: nextArchived,
            feedbackSent: nextArchived ? true : s.feedbackSent,
            archivedAt: nextArchived
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
          if (user) {
            setIsSyncing(true);
            saveSingleSubmission(updatedSub, user.uid)
              .catch((err) => console.error('Cloud archive update error:', err))
              .finally(() => setIsSyncing(false));
          }
          return updatedSub;
        }
        return s;
      })
    );
  };

  const handleSyncLocalToCloud = async () => {
    if (!user || submissions.length === 0) return;
    setIsSyncing(true);
    try {
      await saveSubmissionsBatch(submissions, user.uid);
    } catch (err) {
      console.error('Manual sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const suspiciousCount = currentSimilarityPairs.filter((p) => p.riskLevel === 'high').length;
  const aiAlertCount = currentLabSubmissions.filter((s) => s.aiDetection?.verdict === 'likely_ai').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header with Lab Switcher, Auth & Cloud Sync */}
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
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Cloud Onboarding Banner (if not logged in) */}
        {!user && showSyncBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-sky-50/70 to-indigo-50/90 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Облачная база данных Firebase Firestore подключена</span>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    Бесплатный тариф Spark
                  </span>
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Войдите под своим Google-аккаунтом, чтобы результаты проверок, сводная ведомость и архивы автоматически сохранялись в облаке и были доступны на всех ваших устройствах.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <button
                onClick={loginWithGoogle}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Войти через Google</span>
              </button>
              <button
                onClick={() => setShowSyncBanner(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors"
                title="Скрыть подсказку"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Sync Local Work Banner if user just logged in and has local submissions */}
        {user && submissions.length > 0 && (
          <div className="mb-4 flex items-center justify-between px-4 py-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Облачная синхронизация активна для <strong>{user.email}</strong>. Загруженные работы сохраняются в Firestore.
              </span>
            </div>
            <button
              onClick={handleSyncLocalToCloud}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs hover:bg-emerald-50 transition-colors"
              title="Перезаписать текущие работы в облачную базу данных"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              <span>Синхронизировать всё</span>
            </button>
          </div>
        )}

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
                {activeLab === 'lab5'
                  ? 'Работы по Лабораторной работе №5 ещё не загружены'
                  : activeLab === 'lab4'
                  ? 'Работы по Лабораторной работе №4 ещё не загружены'
                  : activeLab === 'lab3'
                  ? 'Работы по Лабораторной работе №3 ещё не загружены'
                  : activeLab === 'lab2'
                  ? 'Работы по Лабораторной работе №2 ещё не загружены'
                  : 'Работы по Лабораторной работе №1 ещё не загружены'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
                {activeLab === 'lab5'
                  ? 'В этой лабораторной проверяются 23 основные задачи (методы строк: поиск, замена, сдвиги, слова, пути, скобки, без дополнительных). Загрузите работы студентов или мгновенно проверьте демо-примеры.'
                  : activeLab === 'lab4'
                  ? 'В этой лабораторной проверяются 25 основных заданий (базовые типы данных – строки: индексация, срезы, ord/chr, посимвольный анализ, без дополнительных). Загрузите работы студентов или мгновенно проверьте демо-примеры.'
                  : activeLab === 'lab3'
                  ? 'В этой лабораторной проверяются 20 основных заданий (циклы For и While, однопроходные алгоритмы без списков, вложенные циклы). Загрузите работы студентов или мгновенно проверьте демо-примеры.'
                  : activeLab === 'lab2'
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
                  <span>
                    Загрузить демо-работы (
                    {activeLab === 'lab5'
                      ? 'Лаб №5: 23 зад.'
                      : activeLab === 'lab4'
                      ? 'Лаб №4: 25 зад.'
                      : activeLab === 'lab3'
                      ? 'Лаб №3: 20 зад.'
                      : activeLab === 'lab2'
                      ? 'Лаб №2: 25 зад.'
                      : 'Лаб №1'}
                    )
                  </span>
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

        {activeTab === 'template' && <TemplateView />}
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
