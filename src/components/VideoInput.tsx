import { useState } from 'react'

interface VideoInputProps {
  onSubmit: (url: string) => void
}

export function VideoInput({ onSubmit }: VideoInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Paste YouTube URL or video ID..."
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
        disabled={!value.trim()}
      >
        Load
      </button>
    </form>
  )
}
