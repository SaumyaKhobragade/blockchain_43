"use client"
import React from 'react'
import { ClassAnalysis } from '@/types/analysis'
import styles from './analysisSummary.module.css'

interface Props {
  analysis: ClassAnalysis
}

// SVG horizontal bar for grade counts
const GradeBars: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const entries = Object.entries(data)
  const max = Math.max(...entries.map(([, v]) => v), 1)
  const width = 360
  const barHeight = 18
  const gap = 8
  const height = entries.length * (barHeight + gap)
  return (
  <svg id="grade-svg" width={width} height={height} className={styles.svg}>
      <defs>
        <linearGradient id="gradBar" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#732fda" />
          <stop offset="100%" stopColor="#e546dd" />
        </linearGradient>
      </defs>
      {entries.map(([k, v], i) => {
        const y = i * (barHeight + gap)
        const w = Math.round((v / max) * (width - 80))
        return (
          <g key={k} transform={`translate(0, ${y})`}>
            <text x={0} y={barHeight - 4} className={styles.svgLabel}>{k}</text>
            <rect x={60} y={0} width={width - 60} height={barHeight} rx={6} className={styles.svgTrack} />
            <rect x={60} y={0} width={w} height={barHeight} rx={6} fill="url(#gradBar)" />
            <text x={60 + w + 8} y={barHeight - 4} className={styles.svgValue}>{v}</text>
          </g>
        )
      })}
    </svg>
  )
}

const Histogram: React.FC<{ data: { range: string; count: number }[] }> = ({ data }) => {
  const width = 420
  const height = 140
  const max = Math.max(...data.map(d => d.count), 1)
  const barW = Math.floor(width / data.length) - 8
  return (
  <svg id="histogram-svg" width={width} height={height} className={styles.svg}>
      <defs>
        <linearGradient id="gradHist" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x = i * (barW + 8) + 20
        const h = Math.round((d.count / max) * (height - 40))
        return (
          <g key={d.range}>
            <rect x={x} y={height - h - 20} width={barW} height={h} rx={4} fill="url(#gradHist)" />
            <text x={x + barW/2} y={height - 4} className={styles.histLabel} textAnchor="middle">{d.range}</text>
            <text x={x + barW/2} y={height - h - 26} className={styles.histValue} textAnchor="middle">{d.count}</text>
          </g>
        )
      })}
    </svg>
  )
}

export const AnalysisSummary: React.FC<Props> = ({ analysis }) => {
  return (
    <div className={styles.container}>
      <h2>Class Analysis — {analysis.className}</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Students</h3>
          <p className={styles.big}>{analysis.studentCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Mean %</h3>
          <p className={styles.big}>{analysis.meanPercentage.toFixed(2)}%</p>
        </div>
        <div className={styles.card}>
          <h3>Median %</h3>
          <p className={styles.big}>{analysis.medianPercentage.toFixed(2)}%</p>
        </div>
        <div className={styles.card}>
          <h3>Std Dev</h3>
          <p className={styles.big}>{analysis.stdDevPercentage.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Grade Breakdown</h3>
        <GradeBars data={analysis.gradeCounts} />
      </div>

      <div className={styles.section}>
        <h3>Marks Distribution</h3>
        <Histogram data={analysis.marksDistribution} />
      </div>

      <div className={styles.meta}>Generated at: {new Date(analysis.createdAt).toLocaleString()}</div>
    </div>
  )
}

export default AnalysisSummary
