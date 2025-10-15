"use client"
import React, { useMemo, useRef, useState } from 'react'
import { ReportCard } from '@/types/reportCard'
import styles from './topStudentsPie.module.css'

interface Props {
  reportCards: ReportCard[]
}

interface TooltipState {
  name: string
  percentage: number
  sharePct: number
  rank: number
  x: number
  y: number
}

const COLORS = ['#6366f1', '#f97316', '#22d3ee', '#f43f5e', '#14b8a6', '#a855f7']

const TopStudentsPieChart: React.FC<Props> = ({ reportCards }) => {
  const svgBoxRef = useRef<HTMLDivElement | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const data = useMemo(() => {
    if (!reportCards || reportCards.length === 0) return []
    const sorted = [...reportCards].sort((a, b) => b.percentage - a.percentage)
    const rankMap = new Map(sorted.map((card, idx) => [card.id, idx + 1]))
    const top = sorted.slice(0, Math.min(sorted.length, 8))

    const buildSlices = (cards: ReportCard[]) => {
      const total = cards.reduce((acc, card) => acc + card.percentage, 0)
      if (total === 0) return []
      return cards.map(card => ({
        id: card.id,
        studentName: card.studentName,
        percentage: card.percentage,
        share: card.percentage / total,
        rank: rankMap.get(card.id) ?? 0,
      }))
    }

    const candidate = buildSlices(top).filter(slice => slice.share >= 0.12)
    if (candidate.length >= 3) {
      return candidate
    }

    const fallbackSource = top.slice(0, Math.min(top.length, 5))
    const fallback = buildSlices(fallbackSource)
    return fallback.length >= 3 ? fallback : []
  }, [reportCards])

  const handleMouseMove = (evt: React.MouseEvent<SVGCircleElement>, name: string, percentage: number, share: number, rank: number) => {
    const box = svgBoxRef.current?.getBoundingClientRect()
    if (!box) return
    setTooltip({
      name,
      percentage,
      sharePct: share * 100,
      rank,
      x: evt.clientX - box.left,
      y: evt.clientY - box.top,
    })
  }

  const clearTooltip = () => setTooltip(null)

  if (data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.headerRow}>
          <h3>Top Performers Mix</h3>
        </div>
        <p className={styles.placeholder}>Not enough variation to render a meaningful top-performers chart yet.</p>
      </div>
    )
  }

  const radius = 110
  const strokeWidth = 44
  const size = radius * 2 + strokeWidth + 12
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  let accumulatedShare = 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h3>Top Performers Mix</h3>
        <span className={styles.caption}>Normalized against standout students only for readability.</span>
      </div>
      <div className={styles.body}>
        <div className={styles.svgBox} ref={svgBoxRef}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label="Top student share chart"
          >
            <defs>
              <radialGradient id="pieGlow" cx="50%" cy="50%" r="65%">
                <stop offset="35%" stopColor="rgba(11, 3, 38, 0.0)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.18)" />
              </radialGradient>
            </defs>
            <circle cx={center} cy={center} r={radius + strokeWidth / 2 - 4} fill="rgba(12, 18, 36, 0.52)" />
            {data.map((slice, idx) => {
              const segmentLength = slice.share * circumference
              const dashArray = `${segmentLength} ${circumference}`
              const dashOffset = -accumulatedShare * circumference
              accumulatedShare += slice.share
              return (
                <circle
                  key={slice.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${center} ${center})`}
                  className={styles.segment}
                  onMouseMove={(evt) => handleMouseMove(evt, slice.studentName, slice.percentage, slice.share, slice.rank)}
                  onMouseLeave={clearTooltip}
                />
              )
            })}
            <circle cx={center} cy={center} r={radius - strokeWidth / 2 + 6} fill="url(#pieGlow)" />
            <text x={center} y={center - 6} textAnchor="middle" className={styles.centerLabel}>Standouts</text>
            <text x={center} y={center + 20} textAnchor="middle" className={styles.centerValue}>{data.length}</text>
          </svg>
          {tooltip && (
            <div
              className={styles.tooltip}
              style={{ left: tooltip.x, top: tooltip.y }}
              role="presentation"
            >
              <strong>#{tooltip.rank} {tooltip.name}</strong>
              <span>{tooltip.percentage.toFixed(2)}%</span>
              <span>{tooltip.sharePct.toFixed(1)}% of featured set</span>
            </div>
          )}
        </div>
        <ul className={styles.legend}>
          {data.map((slice, idx) => (
            <li key={slice.id} className={styles.legendItem}>
              <span className={styles.swatch} style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span className={styles.legendName}>{slice.studentName}</span>
              <span className={styles.legendValue}>{slice.percentage.toFixed(2)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TopStudentsPieChart
