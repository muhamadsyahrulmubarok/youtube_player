import { useMemo } from 'react'
import type { SubtitleCue } from '../types/subtitle'

interface SubtitleOverlayProps {
  cues: SubtitleCue[]
  currentTime: number
}

export function SubtitleOverlay({ cues, currentTime }: SubtitleOverlayProps) {
  const activeCues = useMemo(() => {
    return cues.filter(
      (cue) => currentTime >= cue.startTime && currentTime <= cue.endTime,
    )
  }, [cues, currentTime])

  if (activeCues.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center px-4">
      <div className="rounded-md bg-black/80 px-4 py-2 backdrop-blur-sm">
        {activeCues.map((cue) => (
          <p
            key={cue.index}
            className="text-center text-lg leading-snug font-medium text-white drop-shadow-lg md:text-xl"
            dangerouslySetInnerHTML={{
              __html: cue.text
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br />'),
            }}
          />
        ))}
      </div>
    </div>
  )
}
