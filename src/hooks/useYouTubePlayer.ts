import { useEffect, useRef, useCallback, useState } from 'react'

declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

let apiLoaded = false
let apiLoadPromise: Promise<void> | null = null

function loadYouTubeAPI(): Promise<void> {
  if (apiLoaded) return Promise.resolve()
  if (apiLoadPromise) return apiLoadPromise

  apiLoadPromise = new Promise<void>((resolve) => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'

    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true
      resolve()
    }

    document.head.appendChild(tag)
  })

  return apiLoadPromise
}

interface UseYouTubePlayerOptions {
  containerId: string
  videoId: string | null
  onTimeUpdate?: (time: number) => void
}

export function useYouTubePlayer({
  containerId,
  videoId,
  onTimeUpdate,
}: UseYouTubePlayerOptions) {
  const playerRef = useRef<YT.Player | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const startTimeTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        onTimeUpdate?.(playerRef.current.getCurrentTime())
      }
    }, 100)
  }, [onTimeUpdate])

  const stopTimeTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!videoId) return

    let destroyed = false

    async function init() {
      await loadYouTubeAPI()
      if (destroyed) return

      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId!)
        return
      }

      playerRef.current = new window.YT.Player(containerId, {
        videoId: videoId!,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: () => {
            if (!destroyed) setIsReady(true)
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (destroyed) return
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
              startTimeTracking()
            } else {
              setIsPlaying(false)
              stopTimeTracking()
              if (playerRef.current?.getCurrentTime) {
                onTimeUpdate?.(playerRef.current.getCurrentTime())
              }
            }
          },
        },
      })
    }

    init()

    return () => {
      destroyed = true
      stopTimeTracking()
    }
  }, [videoId, containerId, startTimeTracking, stopTimeTracking, onTimeUpdate])

  useEffect(() => {
    return () => {
      stopTimeTracking()
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [stopTimeTracking])

  return { player: playerRef, isReady, isPlaying }
}
