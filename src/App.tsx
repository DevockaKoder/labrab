import React, { useState, useEffect } from 'react';
import { StudentSubmission, SimilarityPair } from './types';
import { Header } from './components/Header';
import { StudentGradingView } from './components/StudentGradingView';
import { SimilarityMatrixView } from './components/SimilarityMatrixView';
import { SummaryTable } from './components/SummaryTable';
import { TasksCatalog } from './components/TasksCatalog';
import { UploadModal } from './components/UploadModal';
import { gradeStudentCode } from './utils/grader';
import { compareAllSubmissions } from './utils/similarityEngine';
import { getPyodide } from './utils/pythonRunner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'grading' | 'similarity' | 'summary' | 'tasks'>('grading');
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

  // Handler to process uploaded files
  const handleProcessFiles = async (files: { name: string; content: string }[]) => {
    setIsProcessing(true);
    const newSubmissions: StudentSubmission[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgressText(`Проверка файла ${i + 1} из ${files.length}: ${file.name}`);

      try {
        const graded = await gradeStudentCode(
          file.content,
          file.name,
          (tIdx, total) => {
            setProgressText(`Файл ${i + 1}/${files.length} (${file.name}): тест ${tIdx}/${total}`);
          }
        );
        newSubmissions.push(graded);
      } catch (err: any) {
        console.error('Ошибка проверки файла:', file.name, err);
      }
    }

    // Combine with existing submissions
    const combined = [...submissions, ...newSubmissions];
    // Recalculate similarity matrix
    const pairs = compareAllSubmissions(combined);

    setSubmissions([...combined]);
    setSimilarityPairs(pairs);
    if (!selectedStudentId && combined.length > 0) {
      setSelectedStudentId(combined[0].id);
    }
    setIsProcessing(false);
    setProgressText('');
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
      setSelectedStudentId(updated[0]?.id || '');
    }
  };

  const suspiciousCount = similarityPairs.filter((p) => p.riskLevel === 'high').length;
  const aiAlertCount = submissions.filter((s) => s.aiDetection?.verdict === 'likely_ai').length;

  const handleUpdateSubmission = (updated: StudentSubmission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        submissionsCount={submissions.length}
        suspiciousCount={suspiciousCount}
        aiAlertCount={aiAlertCount}
        isPyodideReady={isPyodideReady}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'grading' && (
          <StudentGradingView
            submissions={submissions}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
            onNavigateToSimilarity={handleNavigateToSimilarity}
            onDeleteSubmission={handleDeleteSubmission}
            onUpdateSubmission={handleUpdateSubmission}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'similarity' && (
          <SimilarityMatrixView
            submissions={submissions}
            similarityPairs={similarityPairs}
            initialStudentAId={diffStudentPair.studentAId}
            initialStudentBId={diffStudentPair.studentBId}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryTable
            submissions={submissions}
            onSelectStudent={(id) => {
              setSelectedStudentId(id);
              setActiveTab('grading');
            }}
            onNavigateToSimilarity={handleNavigateToSimilarity}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'tasks' && <TasksCatalog />}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onProcessFiles={handleProcessFiles}
        isProcessing={isProcessing}
        progressText={progressText}
      />
    </div>
  );
}
