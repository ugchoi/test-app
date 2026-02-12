"use client"

import { useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// 샘플 데이터
const BAR_DATA = [
  { label: "1월", value: 65 },
  { label: "2월", value: 78 },
  { label: "3월", value: 52 },
  { label: "4월", value: 91 },
  { label: "5월", value: 84 },
  { label: "6월", value: 73 },
]

const LINE_DATA = [
  { x: 0, y: 30 },
  { x: 1, y: 45 },
  { x: 2, y: 35 },
  { x: 3, y: 60 },
  { x: 4, y: 55 },
  { x: 5, y: 70 },
]

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 }
const AXIS_COLOR = "hsl(var(--foreground) / 0.3)"
const TEXT_COLOR = "hsl(var(--foreground) / 0.8)"
const GRID_COLOR = "hsl(var(--foreground) / 0.08)"
const BAR_COLOR = "hsl(var(--primary))"
const LINE_COLOR = "hsl(var(--primary))"

function drawBarChart(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const chartWidth = width - PADDING.left - PADDING.right
  const chartHeight = height - PADDING.top - PADDING.bottom
  const maxVal = Math.max(...BAR_DATA.map((d) => d.value))
  const barWidth = chartWidth / BAR_DATA.length * 0.6
  const gap = chartWidth / BAR_DATA.length * 0.4

  // 그리드 (세로선)
  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = PADDING.top + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(PADDING.left, y)
    ctx.lineTo(width - PADDING.right, y)
    ctx.stroke()
  }

  // Y축 눈금 및 레이블
  ctx.fillStyle = TEXT_COLOR
  ctx.font = "12px system-ui, sans-serif"
  ctx.textAlign = "right"
  for (let i = 0; i <= 5; i++) {
    const val = Math.round(maxVal - (maxVal / 5) * i)
    const y = PADDING.top + (chartHeight / 5) * i
    ctx.fillText(String(val), PADDING.left - 8, y + 4)
  }

  // 막대 그리기
  BAR_DATA.forEach((d, i) => {
    const barHeight = (d.value / maxVal) * chartHeight
    const x = PADDING.left + gap / 2 + i * (barWidth + gap)
    const y = PADDING.top + chartHeight - barHeight

    ctx.fillStyle = BAR_COLOR
    ctx.beginPath()
    ctx.roundRect(x, y, barWidth, barHeight, 4)
    ctx.fill()

    // 막대 위 값 표시
    ctx.fillStyle = TEXT_COLOR
    ctx.font = "11px system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(String(d.value), x + barWidth / 2, y - 6)
  })

  // X축 레이블
  ctx.fillStyle = TEXT_COLOR
  ctx.font = "12px system-ui, sans-serif"
  ctx.textAlign = "center"
  BAR_DATA.forEach((d, i) => {
    const x = PADDING.left + gap / 2 + i * (barWidth + gap) + barWidth / 2
    ctx.fillText(d.label, x, height - PADDING.bottom + 20)
  })

  // 축선
  ctx.strokeStyle = AXIS_COLOR
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(PADDING.left, PADDING.top)
  ctx.lineTo(PADDING.left, height - PADDING.bottom)
  ctx.lineTo(width - PADDING.right, height - PADDING.bottom)
  ctx.stroke()
}

function drawLineChart(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const chartWidth = width - PADDING.left - PADDING.right
  const chartHeight = height - PADDING.top - PADDING.bottom
  const maxY = Math.max(...LINE_DATA.map((d) => d.y))
  const minY = Math.min(...LINE_DATA.map((d) => d.y))
  const rangeY = maxY - minY || 1

  // 그리드
  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = PADDING.top + (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(PADDING.left, y)
    ctx.lineTo(width - PADDING.right, y)
    ctx.stroke()
  }

  // Y축 레이블
  ctx.fillStyle = TEXT_COLOR
  ctx.font = "12px system-ui, sans-serif"
  ctx.textAlign = "right"
  for (let i = 0; i <= 4; i++) {
    const val = Math.round(maxY - (rangeY / 4) * i)
    const y = PADDING.top + (chartHeight / 4) * i
    ctx.fillText(String(val), PADDING.left - 8, y + 4)
  }

  // 선 그리기
  const stepX = chartWidth / (LINE_DATA.length - 1)
  const points = LINE_DATA.map((d, i) => ({
    x: PADDING.left + i * stepX,
    y: PADDING.top + chartHeight - ((d.y - minY) / rangeY) * chartHeight,
  }))

  ctx.strokeStyle = LINE_COLOR
  ctx.lineWidth = 2.5
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y))
  ctx.stroke()

  // 데이터 포인트 원
  ctx.fillStyle = LINE_COLOR
  points.forEach((p) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "hsl(var(--background))"
    ctx.lineWidth = 2
    ctx.stroke()
  })

  // 축선
  ctx.strokeStyle = AXIS_COLOR
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(PADDING.left, PADDING.top)
  ctx.lineTo(PADDING.left, height - PADDING.bottom)
  ctx.lineTo(width - PADDING.right, height - PADDING.bottom)
  ctx.stroke()
}

export default function CanvasDemoPage() {
  const barRef = useRef<HTMLCanvasElement>(null)
  const lineRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1

    ;[barRef, lineRef].forEach((ref, idx) => {
      const canvas = ref.current
      if (!canvas) return

      const parent = canvas.parentElement
      if (!parent) return

      const w = parent.clientWidth
      const h = 280

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.scale(dpr, dpr)

      if (idx === 0) drawBarChart(ctx, w, h)
      else drawLineChart(ctx, w, h)
    })
  }, [])

  useEffect(() => {
    draw()
    const ro = new ResizeObserver(draw)
    if (barRef.current?.parentElement) ro.observe(barRef.current.parentElement)
    if (lineRef.current?.parentElement) ro.observe(lineRef.current.parentElement)
    return () => ro.disconnect()
  }, [draw])

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Canvas 데이터 시각화
            </h1>
            <p className="mt-1 text-muted-foreground">
              HTML Canvas API로 그린 막대 차트와 선 차트 예제입니다.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">← 홈으로</Link>
          </Button>
        </div>

        <section className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">월별 매출 (막대 차트)</h2>
          <div className="w-full" style={{ height: 280 }}>
            <canvas ref={barRef} className="block w-full" />
          </div>
        </section>

        <section className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">추이 (선 차트)</h2>
          <div className="w-full" style={{ height: 280 }}>
            <canvas ref={lineRef} className="block w-full" />
          </div>
        </section>

        <p className="text-center text-sm text-muted-foreground">
          캔버스는 반응형으로 리사이즈되며, 고해상도 디스플레이에서 선명하게 보이도록
          devicePixelRatio를 적용했습니다.
        </p>
      </div>
    </div>
  )
}
