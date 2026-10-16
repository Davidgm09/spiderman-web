import { Press_Start_2P } from "next/font/google"

// Fuente pixelada solo para la sección de juegos (no se descarga en el resto de la web)
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-pixel", display: "swap" })

export default function JuegosLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${pixel.variable} arcade-bg crt min-h-screen`}>{children}</div>
}
