const YOUTUBE_ID = /^[\w-]{11}$/

export function toYouTubeEmbedUrl(input: string): string | null {
  try {
    const url = new URL(input.trim())
    if (url.protocol !== "https:" && url.protocol !== "http:") return null

    const host = url.hostname.replace(/^www\./, "")
    let id: string | null = null

    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? null
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v")
      } else if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) {
        id = url.pathname.split("/")[2] ?? null
      }
    }

    if (!id || !YOUTUBE_ID.test(id)) return null
    return `https://www.youtube.com/embed/${id}`
  } catch {
    return null
  }
}
