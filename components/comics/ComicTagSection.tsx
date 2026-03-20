import { LucideIcon } from 'lucide-react'

interface ComicTagSectionProps {
  title: string
  Icon: LucideIcon
  items: string[]
  colors: {
    gradient: string
    border: string
    iconBg: string
    iconText: string
    pillBorder: string
  }
}

export function ComicTagSection({ title, Icon, items, colors }: ComicTagSectionProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="pb-6 border-b border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 ${colors.iconBg} rounded-lg`}>
          <Icon className={`w-4 h-4 ${colors.iconText}`} />
        </div>
        <h3 className="text-white font-bold text-base">{title}</h3>
        <span className={`ml-auto text-xs ${colors.iconText} font-semibold`}>{items.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${colors.pillBorder} bg-white/5 text-gray-300 hover:text-white transition-colors`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
