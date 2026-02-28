import { useEffect, useRef } from 'react'
import type { SubtitleCue } from '../types/subtitle'

interface SubtitleListProps {
  cues: SubtitleCue[]
  currentTime: number
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

export function SubtitleList({ cues, currentTime }: SubtitleListProps) {
  const activeRef = useRef<HTMLDivElement>(null)

  const activeIndex = cues.findIndex(
    (cue) => currentTime >= cue.startTime && currentTime <= cue.endTime,
  )

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeIndex])

  if (cues.length === 0) return null

  return (
    <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800/50 p-2">
      <h3 className="sticky top-0 z-10 bg-zinc-800/90 px-2 py-1 text-xs font-semibold tracking-wider text-zinc-400 uppercase backdrop-blur-sm">
        Subtitles ({cues.length} cues)
      </h3>
      {cues.map((cue, i) => {
        const isActive = i === activeIndex
        return (
          <div
            key={cue.index}
            ref={isActive ? activeRef : undefined}
            className={`rounded px-2 py-1 text-sm transition-colors ${
              isActive
                ? 'bg-red-600/20 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="mr-2 font-mono text-xs text-zinc-600">
              {formatTime(cue.startTime)}
            </span>
            {cue.text.replace(/\n/g, ' ')}
          </div>
        )
      })}
    </div>
  )
}
