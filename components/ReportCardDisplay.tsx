"use client"
import React from "react"
import { ReportCard } from "@/types/reportCard"
import styles from "./reportCardDisplay.module.css"

interface ReportCardDisplayProps {
  reportCard: ReportCard
  onDownload?: () => void
}

export const ReportCardDisplay: React.FC<ReportCardDisplayProps> = ({ 
  reportCard, 
  onDownload 
}) => {
  return (
    <div className={styles.reportCard} id="report-card-print">
      {/* Optional Student Photo */}
      {(reportCard.photoCid || (reportCard.photoName && reportCard.cid)) && (
        <div className={styles.photoContainer}>
          <img
            src={reportCard.photoCid ? `https://gateway.lighthouse.storage/ipfs/${reportCard.photoCid}/${reportCard.photoName}` : `https://gateway.lighthouse.storage/ipfs/${reportCard.cid}/${reportCard.photoName}`}
            alt={`${reportCard.studentName} photo`}
            className={styles.studentPhoto}
          />
        </div>
      )}
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoCircle}>🎓</div>
          </div>
          <div className={styles.schoolInfo}>
            <h1 className={styles.schoolName}>IntelliX Report Card</h1>
            <p className={styles.schoolTagline}>Excellence in Education Through Innovation</p>
          </div>
        </div>
        <div className={styles.badge}>
          <span>{reportCard.overallGrade}</span>
        </div>
      </div>

      {/* Student Info */}
      <div className={styles.studentInfo}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Student Name:</span>
            <span className={styles.value}>{reportCard.studentName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Student ID:</span>
            <span className={styles.value}>{reportCard.studentId}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Class:</span>
            <span className={styles.value}>{reportCard.class}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Section:</span>
            <span className={styles.value}>{reportCard.section}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Academic Year:</span>
            <span className={styles.value}>{reportCard.academicYear}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Term:</span>
            <span className={styles.value}>{reportCard.term}</span>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Max Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {reportCard.subjects.map((subject, index) => (
              <tr key={index}>
                <td className={styles.subjectName}>{subject.name}</td>
                <td>{subject.marks}</td>
                <td>{subject.maxMarks}</td>
                <td>{((subject.marks / subject.maxMarks) * 100).toFixed(1)}%</td>
                <td>
                  <span className={`${styles.gradeBadge} ${styles[`grade${subject.grade.replace('+', 'Plus')}`]}`}>
                    {subject.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <td><strong>Total</strong></td>
              <td><strong>{reportCard.totalMarks}</strong></td>
              <td><strong>{reportCard.maxTotalMarks}</strong></td>
              <td><strong>{reportCard.percentage.toFixed(2)}%</strong></td>
              <td>
                <span className={`${styles.gradeBadge} ${styles[`grade${reportCard.overallGrade.replace('+', 'Plus')}`]}`}>
                  <strong>{reportCard.overallGrade}</strong>
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Remarks */}
      <div className={styles.remarks}>
        <h3>Teacher's Remarks</h3>
        <p>{reportCard.remarks}</p>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerItem}>
          <span className={styles.label}>Teacher:</span>
          <div className={styles.signature}>
            <span className={styles.signatureName}>{reportCard.teacherName}</span>
            <div className={styles.signatureLine}></div>
          </div>
        </div>
        <div className={styles.footerItem}>
          <span className={styles.label}>Date Issued:</span>
          <span className={styles.value}>
            {new Date(reportCard.dateIssued).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* FileCoin CID Badge */}
      {reportCard.cid && (
        <div className={styles.cidBadge}>
          <span className={styles.cidLabel}>Stored on FileCoin:</span>
          <code className={styles.cidValue}>{reportCard.cid}</code>
        </div>
      )}

      {/* Action Buttons */}
      {onDownload && (
        <div className={styles.actions}>
          <button onClick={onDownload} className={styles.downloadBtn}>
            <i className="fa-solid fa-download"></i>
            Download PDF
          </button>
        </div>
      )}
    </div>
  )
}
