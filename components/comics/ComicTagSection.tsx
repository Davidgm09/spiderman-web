import { LucideIcon } from 'lucide-react'

interface ComicTagSectionProps {
  title: string
  Icon: LucideIcon
  items: string[]
  colors: {
    gradient: string   // e.g. "to-red-950/20"
    border: string     // e.g. "border-red-500/30"
    iconBg: string     // e.g. "bg-red-500/20"
    iconText: string   // e.g. "text-red-400"
    pillBorder: string // e.g. "border-red-500/20 hover:border-red-500/40"
  }
}

export function ComicTagSection({ title, Icon, items, colors }: ComicTagSectionProps) {
  if (!items || items.length === 0) return null

  return (
    <div className={`bg-gradient-to-br from-gray-900/80 ${colors.gradient} border ${colors.border} rounded-xl p-8 backdrop-blur-sm`}>
      <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
        <Icon className={`w-8 h-8 mr-3 ${colors.iconText}`} />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`bg-black/40 rounded-lg p-4 border ${colors.pillBorder} transition-all duration-300`}
          >
            <div className="flex items-center">
              <div className={`p-2 ${colors.iconBg} rounded-full mr-3`}>
                <Icon className={`w-4 h-4 ${colors.iconText}`} />
              </div>
              <span className="text-white font-semibold">{item}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
