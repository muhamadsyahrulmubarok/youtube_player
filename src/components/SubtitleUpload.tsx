import { useCallback } from 'react'
import type { SubtitleCue } from '../types/subtitle'
import { parseSrt } from '../utils/srtParser'

interface SubtitleUploadProps {
  onSubtitlesLoaded: (cues: SubtitleCue[], fileName: string) => void
  currentFileName: string | null
}

export function SubtitleUpload({
  onSubtitlesLoaded,
  currentFileName,
}: SubtitleUploadProps) {
  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const cues = parseSrt(content)
        onSubtitlesLoaded(cues, file.name)
      }
      reader.readAsText(file)
    },
    [onSubtitlesLoaded],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.name.endsWith('.srt')) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
        e.target.value = ''
      }
    },
    [handleFile],
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-zinc-700 p-4 transition-colors hover:border-red-500/50"
    >
      <label className="cursor-pointer text-center">
        <input
          type="file"
          accept=".srt"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm text-zinc-300">
            {currentFileName ? (
              <>
                <span className="text-green-400">{currentFileName}</span>
                <span className="text-zinc-500"> — click to replace</span>
              </>
            ) : (
              <>
                Drop <span className="font-semibold text-red-400">.srt</span>{' '}
                file here or click to upload
              </>
            )}
          </span>
        </div>
      </label>
    </div>
  )
}
