"use client"

import { useEffect, useState } from "react"

const RELEASE_DATE = new Date("2026-07-31T00:00:00")

function getTimeLeft() {
  const diff = RELEASE_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const units = [
    { value: time.days, label: "días" },
    { value: time.hours, label: "horas" },
    { value: time.minutes, label: "min" },
    { value: time.seconds, label: "seg" },
  ]

  return (
    <div className="flex items-center gap-3 mt-4">
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white tabular-nums w-14 text-center bg-white/10 rounded-xl py-1.5 backdrop-blur-sm">
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{label}</div>
          </div>
          {i < units.length - 1 && (
            <span className="text-red-400 font-bold text-xl mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  )
}