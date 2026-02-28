import { useState, useCallback } from 'react'
import { VideoInput } from './components/VideoInput'
import { SubtitleUpload } from './components/SubtitleUpload'
import { SubtitleOverlay } from './components/SubtitleOverlay'
import { SubtitleList } from './components/SubtitleList'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import { extractVideoId } from './utils/youtube'
import type { SubtitleCue } from './types/subtitle'

const PLAYER_ID = 'yt-player'

function App() {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [subtitles, setSubtitles] = useState<SubtitleCue[]>([])
  const [subtitleFileName, setSubtitleFileName] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  useYouTubePlayer({
    containerId: PLAYER_ID,
    videoId,
    onTimeUpdate: handleTimeUpdate,
  })

  const handleVideoSubmit = (input: string) => {
    const id = extractVideoId(input)
    if (id) {
      setVideoId(id)
      setError(null)
      setCurrentTime(0)
    } else {
      setError('Invalid YouTube URL or video ID. Please try again.')
    }
  }

  const handleSubtitlesLoaded = (cues: SubtitleCue[], fileName: string) => {
    setSubtitles(cues)
    setSubtitleFileName(fileName)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <svg
            className="h-8 w-8 shrink-0 text-red-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight">
            YouTube Subtitle Player
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 space-y-4">
          <VideoInput onSubmit={handleVideoSubmit} />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <SubtitleUpload
            onSubtitlesLoaded={handleSubtitlesLoaded}
            currentFileName={subtitleFileName}
          />
        </div>

        {videoId ? (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-black">
              <div className="relative aspect-video w-full">
                <div id={PLAYER_ID} className="absolute inset-0" />
                {subtitles.length > 0 && (
                  <SubtitleOverlay
                    cues={subtitles}
                    currentTime={currentTime}
                  />
                )}
              </div>
            </div>

            {subtitles.length > 0 && (
              <SubtitleList cues={subtitles} currentTime={currentTime} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 py-24 text-center">
            <svg
              className="mb-4 h-16 w-16 text-zinc-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg text-zinc-500">
              Paste a YouTube URL above to get started
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              Then upload a .srt file to add custom subtitles
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
