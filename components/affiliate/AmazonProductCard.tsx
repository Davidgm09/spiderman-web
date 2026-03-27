import Image from "next/image"
import { ShoppingCart } from "lucide-react"

interface AmazonProductCardProps {
  title: string
  image: string
  href: string
  badge?: string
  price?: string
  subtitle?: string
  variant?: "featured" | "compact"
  asin?: string  // si se pasa, usa la imagen del producto real de Amazon
}

export function AmazonProductCard({
  title,
  image,
  href,
  badge,
  price,
  subtitle,
  variant = "featured",
  asin,
}: AmazonProductCardProps) {
  const productImage = asin
    ? `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`
    : image
  if (variant === "compact") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col rounded-xl overflow-hidden border border-white/8 hover:border-orange-500/40 bg-gray-900 hover:bg-gray-800 transition-all duration-200"
      >
        <div className="relative w-full aspect-[3/4] bg-gray-800 overflow-hidden">
          <Image
            src={productImage}
            alt={title}
            fill
            sizes="160px"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <span className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wide bg-orange-600 text-white px-1.5 py-0.5 rounded-md">
              {badge}
            </span>
          )}
        </div>
        <div className="p-2.5 flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-200 line-clamp-2 leading-snug">
            {title}
          </p>
          {price && <p className="text-sm font-bold text-white">{price}€</p>}
          <div className="flex items-center justify-center gap-1.5 bg-orange-600 group-hover:bg-orange-500 transition-colors rounded-lg py-2">
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-bold text-white uppercase tracking-wide">Amazon</span>
          </div>
        </div>
      </a>
    )
  }

  // variant === "featured"
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden border border-white/8 hover:border-orange-500/40 bg-gray-900 hover:bg-gray-800 transition-all duration-200"
    >
      <div className="relative w-full aspect-[2/3] bg-gray-800 overflow-hidden">
        <Image
          src={productImage}
          alt={title}
          fill
          sizes="300px"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-orange-600 text-white px-2 py-1 rounded-md shadow">
            {badge}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-100 line-clamp-2 leading-snug">
          {title}
        </p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        {price && <p className="text-lg font-bold text-white">{price}€</p>}
        <div className="flex items-center justify-center gap-2 bg-orange-600 group-hover:bg-orange-500 transition-colors rounded-xl py-2.5">
          <ShoppingCart className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">Comprar en Amazon</span>
        </div>
      </div>
    </a>
  )
}
