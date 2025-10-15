"use client"
import React, { useState } from "react"
import { ReportCard, Subject, calculateGrade, calculatePercentage } from "@/types/reportCard"
import styles from "./reportCardForm.module.css"

interface ReportCardFormProps {
  onSubmit: (reportCard: ReportCard) => void
  isSubmitting?: boolean
}

export const ReportCardForm: React.FC<ReportCardFormProps> = ({ 
  onSubmit, 
  isSubmitting = false 
}) => {
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [className, setClassName] = useState("")
  const [section, setSection] = useState("")
  const [academicYear, setAcademicYear] = useState("")
  const [term, setTerm] = useState("")
  const [teacherName, setTeacherName] = useState("")
  const [remarks, setRemarks] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "Mathematics", marks: 0, maxMarks: 100, grade: "F" },
    { name: "Science", marks: 0, maxMarks: 100, grade: "F" },
    { name: "English", marks: 0, maxMarks: 100, grade: "F" },
  ])

  const updateSubject = (index: number, field: keyof Subject, value: string | number) => {
    const newSubjects = [...subjects]
    if (field === "marks" || field === "maxMarks") {
      newSubjects[index][field] = Number(value)
      const percentage = calculatePercentage(
        newSubjects[index].marks,
        newSubjects[index].maxMarks
      )
      newSubjects[index].grade = calculateGrade(percentage)
    } else {
      newSubjects[index][field] = value as string
    }
    setSubjects(newSubjects)
  }

  const addSubject = () => {
    setSubjects([...subjects, { name: "", marks: 0, maxMarks: 100, grade: "F" }])
  }

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0)
    const maxTotalMarks = subjects.reduce((sum, s) => sum + s.maxMarks, 0)
    const percentage = calculatePercentage(totalMarks, maxTotalMarks)
    const overallGrade = calculateGrade(percentage)

    const reportCard: ReportCard = {
      id: `RC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentName,
      studentId,
      class: className,
      section,
      academicYear,
      term,
      subjects,
      totalMarks,
      maxTotalMarks,
      percentage,
      overallGrade,
      remarks,
      teacherName,
      dateIssued: new Date().toISOString(),
      photoName: photoFile ? photoFile.name : undefined,
    }
    // Pass the selected photo file via a non-serializable side-channel: we'll call onSubmit with the form data
    // The parent page will keep the File object in its own state if needed. We'll return the file as a second arg via a custom property on the function (simpler than changing the signature everywhere).
    // Because TypeScript disallows changing the onSubmit signature, we'll attach the file to (onSubmit as any).lastPhoto temporarily.
    ;(onSubmit as any).lastPhoto = photoFile

    onSubmit(reportCard)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Student Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="studentName">Student Name *</label>
            <input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              placeholder="Enter student name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="studentId">Student ID *</label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              placeholder="Enter student ID"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="class">Class *</label>
            <input
              id="class"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              placeholder="e.g., 10th"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="section">Section *</label>
            <input
              id="section"
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
              placeholder="e.g., A"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="academicYear">Academic Year *</label>
            <input
              id="academicYear"
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
              placeholder="e.g., 2024-2025"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="term">Term *</label>
            <select
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            >
              <option value="">Select Term</option>
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Final Term">Final Term</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Subjects & Marks</h2>
          <button
            type="button"
            onClick={addSubject}
            className={styles.addBtn}
          >
            <i className="fa-solid fa-plus"></i>
            Add Subject
          </button>
        </div>

        <div className={styles.subjectsContainer}>
          {subjects.map((subject, index) => (
            <div key={index} className={styles.subjectCard}>
              <div className={styles.subjectHeader}>
                <span className={styles.subjectNumber}>#{index + 1}</span>
                {subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className={styles.removeBtn}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>

              <div className={styles.subjectFields}>
                <div className={styles.formGroup}>
                  <label>Subject Name *</label>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(index, "name", e.target.value)}
                    required
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Marks Obtained *</label>
                  <input
                    type="number"
                    value={subject.marks}
                    onChange={(e) => updateSubject(index, "marks", e.target.value)}
                    required
                    min="0"
                    max={subject.maxMarks}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Max Marks *</label>
                  <input
                    type="number"
                    value={subject.maxMarks}
                    onChange={(e) => updateSubject(index, "maxMarks", e.target.value)}
                    required
                    min="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Grade</label>
                  <div className={styles.gradeDisplay}>
                    <span className={`${styles.gradeBadge} ${styles[`grade${subject.grade.replace('+', 'Plus')}`]}`}>
                      {subject.grade}
                    </span>
                    <span className={styles.percentage}>
                      {calculatePercentage(subject.marks, subject.maxMarks).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Additional Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="photo">Student Photo (optional)</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
            />
            <small className={styles.hint}>Optional: Upload a photo (jpg, png). Max 5MB recommended.</small>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="teacherName">Teacher Name *</label>
            <input
              id="teacherName"
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              required
              placeholder="Enter teacher name"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="remarks">Remarks *</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
              rows={4}
              placeholder="Enter teacher's remarks about the student's performance..."
            />
          </div>
        </div>
      </div>

      <div className={styles.submitSection}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Processing...
            </>
          ) : (
            <>
              <i className="fa-solid fa-check"></i>
              Generate Report Card
            </>
          )}
        </button>
      </div>
    </form>
  )
}
