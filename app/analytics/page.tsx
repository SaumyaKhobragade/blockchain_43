"use client"
import React, { useEffect, useState } from 'react'
import { ReportCard } from '@/types/reportCard'
import { ClassAnalysis, calculateStats, gradeBuckets, distributionRanges } from '@/types/analysis'
import AnalysisSummary from '@/components/AnalysisSummary'
import styles from './analytics.module.css'
import lighthouse from '@lighthouse-web3/sdk'
import { useAccount, useChainId } from 'wagmi'
import { useEthersSigner } from '@/hooks/useEthers'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

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

  useEffect(() => {
    const stored = localStorage.getItem('reportCards')
    if (stored) {
      try {
        setReportCards(JSON.parse(stored))
      } catch (e) { console.error(e) }
    }
  }, [])

  const classes = Array.from(new Set(reportCards.map(r => r.class))).sort()

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

  const seedSampleData = (className = '10th', count = 10) => {
    const samples: ReportCard[] = []
    for (let i = 0; i < count; i++) {
      const subjects = [
        { name: 'Mathematics', marks: Math.floor(50 + Math.random() * 50), maxMarks: 100, grade: 'F' },
        { name: 'Science', marks: Math.floor(50 + Math.random() * 50), maxMarks: 100, grade: 'F' },
        { name: 'English', marks: Math.floor(50 + Math.random() * 50), maxMarks: 100, grade: 'F' },
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
    setSelectedClass(className)
  }

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
          <button onClick={() => seedSampleData('10th', 12)} className={styles.uploadBtn}>Generate Sample Data</button>
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
