"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ReportCardDisplay } from "@/components/ReportCardDisplay"
import { ReportCard } from "@/types/reportCard"
import styles from "./view.module.css"

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
          {filteredCards.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📚</div>
              <h3>No Report Cards Found</h3>
              <p>
                {reportCards.length === 0
                  ? "Start by creating your first report card"
                  : "No report cards match your search criteria"}
              </p>
              <Link href="/create" className={styles.emptyBtn}>
                <i className="fa-solid fa-plus"></i>
                Create Report Card
              </Link>
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
