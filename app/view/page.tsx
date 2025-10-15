"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { ReportCardDisplay } from "@/components/ReportCardDisplay"
import { ReportCard } from "@/types/reportCard"
import styles from "./view.module.css"

// Real student names pool for realistic sample data
const FIRST_NAMES = [
  "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella", "William",
  "Mia", "James", "Charlotte", "Benjamin", "Amelia", "Lucas", "Harper", "Henry", "Evelyn", "Alexander",
  "Abigail", "Michael", "Emily", "Daniel", "Elizabeth", "Matthew", "Sofia", "Jackson", "Avery", "Sebastian",
  "Ella", "David", "Scarlett", "Joseph", "Grace", "Carter", "Chloe", "Owen", "Victoria", "Wyatt",
  "Riley", "John", "Aria", "Jack", "Lily", "Luke", "Aubrey", "Jayden", "Zoey", "Dylan",
  "Penelope", "Grayson", "Layla", "Levi", "Nora", "Isaac", "Hannah", "Gabriel", "Lillian", "Julian",
  "Addison", "Mateo", "Eleanor", "Anthony", "Natalie", "Jaxon", "Luna", "Lincoln", "Savannah", "Joshua",
  "Brooklyn", "Christopher", "Leah", "Andrew", "Zoe", "Theodore", "Stella", "Caleb", "Hazel", "Ryan",
  "Ellie", "Asher", "Paisley", "Nathan", "Audrey", "Thomas", "Skylar", "Leo", "Violet", "Isaiah",
  "Claire", "Charles", "Bella", "Josiah", "Aurora", "Hudson", "Lucy", "Christian", "Anna", "Hunter"
]

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
]

export default function ViewReportCards() {
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [selectedCard, setSelectedCard] = useState<ReportCard | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("")

  const seedSampleData = useCallback((className = "10th", count = 100) => {
    const samples: ReportCard[] = []
    for (let i = 0; i < count; i++) {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
      const subjects = [
        { name: "Mathematics", marks: Math.floor(45 + Math.random() * 55), maxMarks: 100, grade: "F" },
        { name: "Science", marks: Math.floor(45 + Math.random() * 55), maxMarks: 100, grade: "F" },
        { name: "English", marks: Math.floor(45 + Math.random() * 55), maxMarks: 100, grade: "F" },
      ]
      const totalMarks = subjects.reduce((s, x) => s + x.marks, 0)
      const maxTotalMarks = subjects.reduce((s, x) => s + x.maxMarks, 0)
      const percentage = Math.round((totalMarks / maxTotalMarks) * 10000) / 100
      samples.push({
        id: `RC-sample-${Date.now()}-${i}`,
        studentName: `${firstName} ${lastName}`,
        studentId: `S-${1000 + i}`,
        class: className,
        section: "A",
        academicYear: "2024-2025",
        term: "Annual",
        subjects,
        totalMarks,
        maxTotalMarks,
        percentage,
        overallGrade: "",
        remarks: "Auto-generated sample",
        teacherName: "Auto",
        dateIssued: new Date().toISOString(),
      })
    }
    localStorage.setItem("reportCards", JSON.stringify(samples))
    setReportCards(samples)
  }, [])

  useEffect(() => {
    // Load report cards from localStorage or seed sample data if empty
    const stored = localStorage.getItem("reportCards")
    if (stored) {
      try {
        const cards = JSON.parse(stored)
        if (Array.isArray(cards) && cards.length > 0) {
          setReportCards(cards)
          return
        }
      } catch (e) {
        console.error("Failed to load report cards:", e)
      }
    }
    seedSampleData("10th", 100)
  }, [seedSampleData])

  const filteredCards = reportCards.filter((card) => {
    const matchesSearch =
      card.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = !filterClass || card.class === filterClass
    return matchesSearch && matchesClass
  })

  const classes = Array.from(new Set(reportCards.map((card) => card.class)))

  const gradeCounts = useMemo(() => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    for (const c of reportCards) {
      const g = (c.overallGrade || "").toUpperCase()
      if (g in counts) {
        counts[g] += 1
      }
    }
    return counts
  }, [reportCards])

  function PieChart({ counts, size = 180 }: { counts: Record<string, number>; size?: number }) {
    const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1
    const colors: Record<string, string> = { A: "#4caf50", B: "#8bc34a", C: "#ffc107", D: "#ff9800", F: "#f44336" }

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

    if (slices.length === 0) {
      return (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ padding: "0.75rem 1.5rem", borderRadius: 9999, border: "1px dashed rgba(148,163,184,0.3)", color: "rgba(226,232,240,0.75)", fontSize: 14 }}>
            No grade data available yet
          </div>
        </div>
      )
    }

    return (
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          {slices.map((s) => (
            <path key={s.key} d={s.d} fill={s.color} stroke="#0b0326" strokeWidth={1} />
          ))}
        </svg>
      </div>
    )
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
          <div className={styles.actionGroup}>
            <Link href="/create" className={styles.createBtn}>
              <i className="fa-solid fa-plus"></i>
              Create New
            </Link>
            <Link href="/analytics" className={styles.analyticsBtn}>
              <i className="fa-solid fa-chart-line"></i>
              View Analytics
            </Link>
          </div>
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
                <Link href="/analytics" className={styles.emptySecondaryBtn}>
                  <i className="fa-solid fa-chart-line"></i>
                  Go to Analytics
                </Link>
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
