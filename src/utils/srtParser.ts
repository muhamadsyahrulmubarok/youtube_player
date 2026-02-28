import type { SubtitleCue } from '../types/subtitle'

function parseTimestamp(timestamp: string): number {
  const parts = timestamp.trim().split(':')
  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  const secParts = parts[2].replace(',', '.').split('.')
  const seconds = parseInt(secParts[0], 10)
  const milliseconds = parseInt(secParts[1] || '0', 10)

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000
}

export function parseSrt(srtContent: string): SubtitleCue[] {
  const normalized = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const blocks = normalized.trim().split(/\n\n+/)
  const cues: SubtitleCue[] = []

  for (const block of blocks) {
    const lines = block.trim().split('\n')
    if (lines.length < 3) continue

    const index = parseInt(lines[0], 10)
    if (isNaN(index)) continue

    const timeLine = lines[1]
    const timeMatch = timeLine.match(
      /(\d{2}:\d{2}:\d{2}[,.]?\d{0,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]?\d{0,3})/,
    )
    if (!timeMatch) continue

    const startTime = parseTimestamp(timeMatch[1])
    const endTime = parseTimestamp(timeMatch[2])
    const text = lines.slice(2).join('\n')

    cues.push({ index, startTime, endTime, text })
  }

  return cues
}
