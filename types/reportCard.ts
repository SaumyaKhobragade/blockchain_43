// Report Card Data Types

export interface Subject {
  name: string;
  marks: number;
  maxMarks: number;
  grade: string;
}

export interface ReportCard {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  section: string;
  academicYear: string;
  term: string;
  subjects: Subject[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  overallGrade: string;
  remarks: string;
  teacherName: string;
  dateIssued: string;
  cid?: string; // FileCoin CID
  // Optional student photo information
  photoName?: string; // original filename (used to build gateway path)
  photoCid?: string; // CID where photo is stored (if uploaded)
}

export const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

export const calculatePercentage = (obtained: number, total: number): number => {
  return total > 0 ? (obtained / total) * 100 : 0;
};
