"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { ReportCard } from '@/types/reportCard'
import { ClassAnalysis, calculateStats, gradeBuckets, distributionRanges } from '@/types/analysis'
import AnalysisSummary from '@/components/AnalysisSummary'
import styles from './analytics.module.css'
import lighthouse from '@lighthouse-web3/sdk'
import { useAccount, useChainId } from 'wagmi'
import { useEthersSigner } from '@/hooks/useEthers'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

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

export default function AnalyticsPage() {
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ClassAnalysis | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [cid, setCid] = useState<string | null>(null)

  const { isConnected } = useAccount()
  const signer = useEthersSigner()

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
    setSelectedClass(className)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('reportCards')
    if (stored) {
      try {
        const cards = JSON.parse(stored)
        if (Array.isArray(cards) && cards.length > 0) {
          setReportCards(cards)
          return
        }
      } catch (e) { console.error(e) }
    }
    // Auto-seed with realistic names if no data exists
    seedSampleData("10th", 100)
  }, [seedSampleData])

  const classes = Array.from(new Set(reportCards.map(r => r.class))).sort()

  // Auto-select first class when data loads
  useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0])
    }
  }, [classes, selectedClass])

  useEffect(() => {
    if (!selectedClass) return
    const cards = reportCards.filter(r => r.class === selectedClass)
    const percentages = cards.map(c => c.percentage)
    const stats = calculateStats(percentages)
    const grades = gradeBuckets(percentages)
    const dist = distributionRanges(percentages)
    const analysisObj: ClassAnalysis = {
      className: selectedClass,
      studentCount: cards.length,
      meanPercentage: stats.mean,
      medianPercentage: stats.median,
      stdDevPercentage: stats.stddev,
      minPercentage: stats.min,
      maxPercentage: stats.max,
      gradeCounts: grades,
      marksDistribution: dist,
      createdAt: new Date().toISOString()
    }
    setAnalysis(analysisObj)
  }, [selectedClass, reportCards])

  const handleUploadAnalysis = async () => {
    if (!analysis) return
    if (!isConnected || !signer) {
      setError('Please connect your wallet to upload analysis')
      return
    }
    setIsUploading(true); setError(null); setUploadProgress(0)
    try {
      // Send analysis to the server-side upload endpoint which keeps the API key secret
      const resp = await fetch('/api/upload-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis),
      })
      const data = await resp.json()
      if (!resp.ok || !data?.cid) {
        throw new Error(data?.error || 'Server upload failed')
      }

      const newCid = data.cid as string

      // store on chain (client-side via wallet)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI as ethers.InterfaceAbi, signer)
      const tx = await contract.store(newCid)
      await tx.wait()

      setCid(newCid)
      setIsUploading(false)
    } catch (e) {
      console.error('analysis upload error', e)
      setError(e instanceof Error ? e.message : String(e))
      setIsUploading(false)
    }
  }

  // Helper: find an SVG in the page (by query) and export it to PNG
  const exportSvgToPng = async (selector: string, fileName = 'chart.png') => {
    try {
      const el = document.querySelector(selector) as SVGSVGElement | null
      if (!el) {
        setError('Chart SVG not found')
        return
      }
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(el)
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = el.clientWidth || 800
        canvas.height = el.clientHeight || 400
        const ctx = canvas.getContext('2d')
        if (!ctx) { setError('Cannot create canvas context'); return }
        ctx.fillStyle = '#0b0326'
        ctx.fillRect(0,0,canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        canvas.toBlob((b) => {
          if (!b) { setError('Export failed'); return }
          const a = document.createElement('a')
          a.href = URL.createObjectURL(b)
          a.download = fileName
          a.click()
        })
        URL.revokeObjectURL(url)
      }
      img.onerror = (e) => { setError('Failed to render SVG for export') }
      img.src = url
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analytics</h1>
        <div className={styles.controls}>
          <select
            value={selectedClass || ''}
            onChange={(e) => setSelectedClass(e.target.value || null)}
            className={styles.classSelect}
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={handleUploadAnalysis} disabled={!analysis || isUploading} className={styles.uploadBtn}>{isUploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Upload Analysis'}</button>
        </div>
      </div>

      <div className={styles.content}>
        {analysis ? (
          <>
            <AnalysisSummary analysis={analysis} />
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button onClick={() => exportSvgToPng('#grade-svg', `grade-breakdown-${analysis.className}.png`)} className={styles.uploadBtn}>Export Grade Chart</button>
              <button onClick={() => exportSvgToPng('#histogram-svg', `distribution-${analysis.className}.png`)} className={styles.uploadBtn}>Export Distribution</button>
            </div>
          </>
        ) : <div className={styles.empty}>Select a class to generate analysis</div>}
      </div>

      {cid && (
        <div className={styles.cidBox}>
          Analysis uploaded: <code>{cid}</code>
        </div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}
