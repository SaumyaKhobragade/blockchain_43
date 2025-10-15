export interface ClassAnalysis {
  className: string
  studentCount: number
  meanPercentage: number
  medianPercentage: number
  stdDevPercentage: number
  minPercentage: number
  maxPercentage: number
  gradeCounts: Record<string, number>
  marksDistribution: Array<{ range: string; count: number }>
  createdAt: string
}

export const calculateStats = (percentages: number[]) : {
  mean: number
  median: number
  stddev: number
  min: number
  max: number
} => {
  if (percentages.length === 0) return { mean: 0, median: 0, stddev: 0, min: 0, max: 0 }
  const n = percentages.length
  const mean = percentages.reduce((s, v) => s + v, 0) / n
  const sorted = [...percentages].sort((a,b) => a - b)
  const mid = Math.floor(n/2)
  const median = n % 2 === 0 ? (sorted[mid-1] + sorted[mid]) / 2 : sorted[mid]
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const variance = percentages.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n
  const stddev = Math.sqrt(variance)
  return { mean, median, stddev, min, max }
}

export const gradeBuckets = (percentages: number[]) => {
  const buckets: Record<string, number> = { 'A+':0,'A':0,'B+':0,'B':0,'C':0,'D':0,'F':0 }
  percentages.forEach(p => {
    if (p >= 90) buckets['A+']++
    else if (p >= 80) buckets['A']++
    else if (p >= 70) buckets['B+']++
    else if (p >= 60) buckets['B']++
    else if (p >= 50) buckets['C']++
    else if (p >= 40) buckets['D']++
    else buckets['F']++
  })
  return buckets
}

export const distributionRanges = (percentages: number[]) => {
  const ranges = ["0-39","40-49","50-59","60-69","70-79","80-89","90-100"]
  const counts: Record<string, number> = Object.fromEntries(ranges.map(r => [r, 0]))
  percentages.forEach(p => {
    if (p < 40) counts["0-39"]++
    else if (p < 50) counts["40-49"]++
    else if (p < 60) counts["50-59"]++
    else if (p < 70) counts["60-69"]++
    else if (p < 80) counts["70-79"]++
    else if (p < 90) counts["80-89"]++
    else counts["90-100"]++
  })
  return ranges.map(r => ({ range: r, count: counts[r] }))
}
