import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { SITE_URL } from "@/lib/config"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ label: "Inicio", href: "/" }, ...items]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${SITE_URL}${item.href}` }),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-400 mb-6 flex-wrap">
        {allItems.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0" />}
            {index === 0 && <Home className="w-3 h-3 flex-shrink-0" />}
            {item.href && index < allItems.length - 1 ? (
              <Link href={item.href} className="hover:text-red-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-300 truncate max-w-[200px]">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
