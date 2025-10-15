"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ReportCardDisplay } from "@/components/ReportCardDisplay"
import { ReportCard } from "@/types/reportCard"
import styles from "./view.module.css"
import { useMemo } from "react"

export default function ViewReportCards() {
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [selectedCard, setSelectedCard] = useState<ReportCard | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("")

  useEffect(() => {
    // Load report cards from localStorage
    const stored = localStorage.getItem("reportCards")
    if (stored) {
      try {
        const cards = JSON.parse(stored)
        setReportCards(cards)
      } catch (e) {
        console.error("Failed to load report cards:", e)
      }
    }
  }, [])

  const filteredCards = reportCards.filter((card) => {
    const matchesSearch =
      card.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = !filterClass || card.class === filterClass
    return matchesSearch && matchesClass
  })

  const classes = Array.from(new Set(reportCards.map((card) => card.class)))

  const gradeCounts = useMemo(() => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0, Unknown: 0 }
    for (const c of reportCards) {
      const g = (c.overallGrade || "").toUpperCase()
      if (g && counts[g] !== undefined) counts[g]++
      else if (g && /^[A-D]$/.test(g)) counts[g] = (counts[g] || 0) + 1
      else if (g === "F") counts.F++
      else counts.Unknown++
    }
    return counts
  }, [reportCards])

  function PieChart({ counts, size = 180 }: { counts: Record<string, number>; size?: number }) {
    const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1
    const colors: Record<string, string> = { A: "#4caf50", B: "#8bc34a", C: "#ffc107", D: "#ff9800", F: "#f44336", Unknown: "#9e9e9e" }

    let cumulative = 0
    const slices = Object.keys(counts).filter((k) => counts[k] > 0).map((k) => {
      const value = counts[k]
      const start = (cumulative / total) * 2 * Math.PI
      cumulative += value
      const end = (cumulative / total) * 2 * Math.PI
      const large = end - start > Math.PI ? 1 : 0
      // polar to cartesian
      const r = size / 2
      const sx = r + r * Math.cos(start - Math.PI / 2)
      const sy = r + r * Math.sin(start - Math.PI / 2)
      const ex = r + r * Math.cos(end - Math.PI / 2)
      const ey = r + r * Math.sin(end - Math.PI / 2)
      const d = `M ${r} ${r} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z`
      return { key: k, value, d, color: colors[k] || "#666" }
    })

    return (
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          {slices.map((s) => (
            <path key={s.key} d={s.d} fill={s.color} stroke="#fff" strokeWidth={1} />
          ))}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.keys(counts).map((k) => (
            <div key={k} style={{ display: "flex", gap: 8, alignItems: "center", opacity: counts[k] ? 1 : 0.5 }}>
              <span style={{ width: 12, height: 12, background: colors[k] || "#666", display: "inline-block", borderRadius: 3 }} />
              <strong style={{ minWidth: 24 }}>{k}</strong>
              <span> {counts[k]} </span>
              <span style={{ color: "#666", fontSize: 12 }}>({((counts[k] / total) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const seedSampleData = (className = '10th', count = 50) => {
    const samples: ReportCard[] = []
    for (let i = 0; i < count; i++) {
      const subjects = [
        { name: 'Mathematics', marks: Math.floor(45 + Math.random() * 55), maxMarks: 100, grade: 'F' },
        { name: 'Science', marks: Math.floor(45 + Math.random() * 55), maxMarks: 100, grade: 'F' },
        { name: 'English', marks: Math.floor(45 + Math.random() * 55), maxMarks: 100, grade: 'F' },
      ]
      const totalMarks = subjects.reduce((s, x) => s + x.marks, 0)
      const maxTotalMarks = subjects.reduce((s, x) => s + x.maxMarks, 0)
      const percentage = Math.round((totalMarks / maxTotalMarks) * 10000) / 100
      const rc: ReportCard = {
        id: `RC-sample-${Date.now()}-${i}`,
        studentName: `Sample Student ${i + 1}`,
        studentId: `S-${1000 + i}`,
        class: className,
        section: 'A',
        academicYear: '2024-2025',
        term: 'Annual',
        subjects,
        totalMarks,
        maxTotalMarks,
        percentage,
        overallGrade: '',
        remarks: 'Auto-generated sample',
        teacherName: 'Auto',
        dateIssued: new Date().toISOString(),
      }
      samples.push(rc)
    }
    localStorage.setItem('reportCards', JSON.stringify(samples))
    setReportCards(samples)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>
            <i className="fa-solid fa-arrow-left"></i>
            Back to Home
          </Link>
          <h1 className={styles.title}>All Report Cards</h1>
          <Link href="/create" className={styles.createBtn}>
            <i className="fa-solid fa-plus"></i>
            Create New
          </Link>
        </div>
      </div>

      {!selectedCard ? (
        <div className={styles.main}>
          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className={styles.classFilter}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Report Cards Grid */}
          {/* Grade distribution pie chart */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart counts={gradeCounts} size={160} />
          </div>
          {filteredCards.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📚</div>
              <h3>No Report Cards Found</h3>
              <p>
                {reportCards.length === 0
                  ? "Start by creating your first report card"
                  : "No report cards match your search criteria"}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: '1rem' }}>
                <Link href="/create" className={styles.emptyBtn}>
                  <i className="fa-solid fa-plus"></i>
                  Create Report Card
                </Link>
                <button onClick={() => seedSampleData('10th', 50)} className={styles.emptyBtn}>
                  <i className="fa-solid fa-database"></i>
                  Generate Sample Data
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.cardsGrid}>
              {filteredCards.map((card) => (
                <div key={card.id} className={styles.cardItem}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardBadge}>{card.overallGrade}</div>
                    <h3>{card.studentName}</h3>
                  </div>

                  <div className={styles.cardDetails}>
                    <div className={styles.cardDetail}>
                      <i className="fa-solid fa-id-card"></i>
                      <span>{card.studentId}</span>
                    </div>
                    <div className={styles.cardDetail}>
                      <i className="fa-solid fa-school"></i>
                      <span>
                        {card.class} - {card.section}
                      </span>
                    </div>
                    <div className={styles.cardDetail}>
                      <i className="fa-solid fa-calendar"></i>
                      <span>{card.term}</span>
                    </div>
                    <div className={styles.cardDetail}>
                      <i className="fa-solid fa-percentage"></i>
                      <span>{card.percentage.toFixed(2)}%</span>
                    </div>
                  </div>

                  {card.cid && (
                    <div className={styles.fileCoinBadge}>
                      <i className="fa-solid fa-database"></i>
                      Stored on FileCoin
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedCard(card)}
                    className={styles.viewBtn}
                  >
                    <i className="fa-solid fa-eye"></i>
                    View Full Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.detailView}>
          <div className={styles.detailHeader}>
            <button
              onClick={() => setSelectedCard(null)}
              className={styles.backBtn}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to List
            </button>
          </div>
          <ReportCardDisplay
            reportCard={selectedCard}
            onDownload={() => window.print()}
          />
        </div>
      )}
    </div>
  )
}
