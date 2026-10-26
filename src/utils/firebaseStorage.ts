import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { StudentSubmission, GradeScale3, GradeScale3Details } from '../types';
import { generateStudentFeedback } from './feedbackGenerator';

function getGradeScale3Details(grade: GradeScale3): GradeScale3Details {
  switch (grade) {
    case 3:
      return {
        score: 3,
        label: '3 / 3',
        verdictTitle: 'Отлично',
        description: 'Все обязательные задачи решены верно, стиль и структура соблюдены',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    case 2:
      return {
        score: 2,
        label: '2 / 3',
        verdictTitle: 'Есть ошибки',
        description: 'Большинство задач решено, но есть недочеты или неверные тесты',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 1:
      return {
        score: 1,
        label: '1 / 3',
        verdictTitle: 'Много ошибок',
        description: 'Сдана малая часть задач или нарушены критические требования',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 0:
    default:
      return {
        score: 0,
        label: '0 / 3',
        verdictTitle: 'Не зачтено',
        description: 'Код не запускается, синтаксические ошибки или нет решений',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      };
  }
}

export function submissionToDoc(sub: StudentSubmission, teacherUid: string) {
  // Ensure strict field lengths and types adhering to firestore.rules
  const cleanId = String(sub.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`)
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .slice(0, 128);

  const rawFeedback = generateStudentFeedback(sub);

  return {
    id: cleanId,
    teacherUid,
    labId: String(sub.labId || 'lab1').slice(0, 32),
    studentName: (sub.studentName || 'Студент').slice(0, 150),
    group: (sub.groupName || '').slice(0, 50),
    rawMoodleName: (sub.fileName || '').slice(0, 300),
    totalScore: Number(Number(sub.totalScore || 0).toFixed(2)),
    maxScore: Number(sub.maxPossibleScore || 20),
    grade: Number(sub.gradeScale3 ?? 0),
    feedback: rawFeedback.slice(0, 10000),
    isArchived: !!sub.isArchived,
    tasksResultsJson: JSON.stringify(sub.results || {}).slice(0, 50000),
    code: (sub.rawCode || '').slice(0, 100000),
    updatedAt: new Date().toISOString(),
  };
}

export function docToSubmission(data: any): StudentSubmission {
  let parsedResults = {};
  if (data.tasksResultsJson) {
    try {
      parsedResults = JSON.parse(data.tasksResultsJson);
    } catch (e) {
      console.warn('Failed to parse tasksResultsJson:', e);
    }
  }

  const grade = (typeof data.grade === 'number' && data.grade >= 0 && data.grade <= 3 ? data.grade : 0) as GradeScale3;
  const totalScore = typeof data.totalScore === 'number' ? data.totalScore : 0;
  const defaultMax = data.labId === 'lab5' ? 23 : data.labId === 'lab4' ? 25 : data.labId === 'lab3' ? 20 : data.labId === 'lab2' ? 25 : 18;
  const maxPossibleScore = typeof data.maxScore === 'number' ? data.maxScore : defaultMax;
  const gradePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  return {
    id: data.id,
    labId: data.labId || 'lab1',
    studentName: data.studentName || 'Студент',
    groupName: data.group || '',
    fileName: data.rawMoodleName || `${data.studentName || 'student'}.py`,
    rawCode: data.code || '',
    uploadedAt: data.updatedAt || new Date().toISOString(),
    tasks: {},
    results: parsedResults,
    totalScore,
    maxPossibleScore,
    gradePercentage,
    gradeScale3: grade,
    gradeScale3Details: getGradeScale3Details(grade),
    isArchived: !!data.isArchived,
    feedbackSent: !!data.isArchived,
    archivedAt: data.isArchived ? data.updatedAt : undefined,
  };
}

/**
 * Saves or updates a single submission to Firestore.
 */
export async function saveSingleSubmission(sub: StudentSubmission, teacherUid: string): Promise<void> {
  const docPayload = submissionToDoc(sub, teacherUid);
  const path = `submissions/${docPayload.id}`;
  try {
    await setDoc(doc(db, 'submissions', docPayload.id), docPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Saves multiple submissions to Firestore in batches.
 */
export async function saveSubmissionsBatch(subs: StudentSubmission[], teacherUid: string): Promise<void> {
  if (subs.length === 0) return;
  const path = 'submissions';
  try {
    const batch = writeBatch(db);
    subs.forEach((sub) => {
      const payload = submissionToDoc(sub, teacherUid);
      const docRef = doc(db, 'submissions', payload.id);
      batch.set(docRef, payload, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes a submission from Firestore.
 */
export async function deleteSubmissionFromCloud(id: string): Promise<void> {
  const path = `submissions/${id}`;
  try {
    await deleteDoc(doc(db, 'submissions', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribes to real-time updates of submissions for the current teacher.
 */
export function subscribeToSubmissions(
  teacherUid: string,
  onUpdate: (subs: StudentSubmission[]) => void,
  onError?: (error: any) => void
) {
  const path = 'submissions';
  const q = query(collection(db, 'submissions'), where('teacherUid', '==', teacherUid));

  return onSnapshot(
    q,
    (snapshot) => {
      const subs: StudentSubmission[] = [];
      snapshot.forEach((d) => {
        subs.push(docToSubmission(d.data()));
      });
      onUpdate(subs);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}
