'use client'

import { useState, useEffect, useRef } from 'react'

export function StickyAffiliateSidebar({ children }: { children: React.ReactNode }) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ right: number; width: number } | null>(null)

  useEffect(() => {
    const update = () => {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({
        right: window.innerWidth - rect.right,
        width: rect.width,
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <>
      {/* Ancla invisible: ocupa el espacio en el grid y da la posición exacta */}
      <div ref={anchorRef} className="w-full h-full" />

      {/* Sidebar fixed en la misma posición que la columna del grid */}
      {pos && (
        <div
          className="hidden lg:block fixed z-20 space-y-4"
          style={{ top: '5.5rem', right: pos.right, width: pos.width }}
        >
          {children}
        </div>
      )}
    </>
  )
}
