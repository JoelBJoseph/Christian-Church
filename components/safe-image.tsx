import Image from "next/image"
import { isHttpUrl } from "@/lib/text"

function isLocalSrc(src: string) {
  return src.startsWith("/") && !src.startsWith("//") && !src.includes("..") && !src.includes("\\")
}

export function SafeImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (isLocalSrc(src)) {
    return <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} />
  }

  if (!isHttpUrl(src)) return null

  return (
    // Admin-provided remote images stay as plain images so the optimizer does not fetch arbitrary hosts.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className ?? ""}`} />
  )
}
