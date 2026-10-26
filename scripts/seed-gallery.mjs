import "dotenv/config"
import { readdir, rm } from "fs/promises"
import path from "path"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const galleryDir = path.resolve("public/images/gallery")
const duplicateDir = path.resolve("public/gallery")

const photoCatalog = {
  "IMG-20230820-WA0124": ["Preaching the Word", "Worship", "A message shared from the pulpit."],
  "IMG-20230820-WA0128": ["Communion lifted", "Communion", "The communion vessels lifted before the church."],
  "IMG-20230820-WA0130": ["Serving communion", "Communion", "Preparing the table for communion."],
  "IMG-20230820-WA0136": ["Prayer at the table", "Prayer", "Prayer beside the communion table."],
  "IMG-20230820-WA0138": ["At the pulpit", "Worship", "A quiet moment before the congregation."],
  "IMG-20230820-WA0145": ["A moment of prayer", "Prayer", "Two brothers pausing to pray together."],
  "IMG-20230820-WA0147": ["Leading in song", "Worship", "Worship led from the front of the church."],
  "IMG-20230820-WA0149": ["Sunday worship", "Worship", "The Word and worship side by side."],
  "IMG-20230820-WA0151": ["Down the aisle", "Congregation", "The church gathered for worship."],
  "IMG-20230820-WA0153": ["Gathered together", "Congregation", "The congregation during Sunday worship."],
  "IMG-20230820-WA0155": ["Worship and the Word", "Worship", "Singing and teaching in the same service."],
  "IMG-20230820-WA0157": ["A song of praise", "Worship", "Praise from the music stand."],
  "IMG-20230820-WA0159": ["Teaching the church", "Worship", "Teaching from the wooden pulpit."],
  "IMG-20230820-WA0167": ["Sharing a word", "Worship", "A word shared with the congregation."],
  "IMG-20230910-WA0013": ["A family in church", "Congregation", "A family standing together in the sanctuary."],
  "IMG-20230910-WA0015": ["Family portrait", "Congregation", "Parents and children after the service."],
  "IMG-20230917-WA0032": ["Reading the Word", "Worship", "Scripture read aloud for the church."],
  "IMG-20230917-WA0034": ["Children in worship", "Congregation", "Children joining the church in praise."],
  "IMG-20230917-WA0040": ["The church at worship", "Congregation", "Hands lifted across the sanctuary."],
  "IMG-20230917-WA0046": ["Worship together", "Congregation", "The congregation singing and praying."],
  "IMG-20230917-WA0048": ["Praise in the pews", "Congregation", "Praise rising from the congregation."],
  "IMG-20230924-WA0061": ["Standing in worship", "Congregation", "The church standing together in worship."],
  "IMG-20251231-WA0030": ["A young voice", "Worship", "A young woman sharing a song."],
  "IMG-20251231-WA0033": ["Sharing a song", "Worship", "Singing before the church."],
  "IMG-20251231-WA0046": ["Singing to the Lord", "Worship", "A song offered during the gathering."],
  "IMG-20251231-WA0059": ["A gift of love", "Fellowship", "A gift shared at the front of the church."],
  "IMG-20251231-WA0063": ["A gift for a singer", "Fellowship", "A small gift given after worship."],
  "IMG-20251231-WA0065": ["Sharing a gift", "Fellowship", "A gift passed from one member to another."],
  "IMG-20251231-WA0067": ["A gift for the children", "Fellowship", "Children receiving a gift from the church."],
  "IMG-20251231-WA0071": ["Gifts among friends", "Fellowship", "Fellowship as gifts are exchanged."],
  "IMG-20251231-WA0073": ["Sharing with one another", "Fellowship", "Two women exchanging a gift."],
  "IMG-20251231-WA0075": ["A blessing for an elder", "Fellowship", "An elder receiving a gift from the church."],
  "IMG-20251231-WA0077": ["A small gift", "Fellowship", "A child receiving a gift on the platform."],
  "IMG-20251231-WA0079": ["Encouraging a child", "Fellowship", "A word of encouragement with a gift."],
  "IMG-20251231-WA0089": ["A gift for a student", "Fellowship", "A young man receiving a gift."],
  "IMG-20251231-WA0095": ["Receiving a gift", "Fellowship", "A wrapped gift given during fellowship."],
  "IMG-20251231-WA0096": ["A gift for a boy", "Fellowship", "A boy receiving a gift from the church."],
  "IMG-20251231-WA0100": ["Receiving a blessing", "Fellowship", "A gift received at the front of the sanctuary."],
  "IMG-20251231-WA0102": ["A gift for a child", "Fellowship", "A child smiling as he receives a gift."],
  "IMG-20251231-WA0104": ["A gift for a girl", "Fellowship", "A girl receiving a wrapped gift."],
  "IMG-20251231-WA0110": ["A wrapped blessing", "Fellowship", "A gold-wrapped gift given to a boy."],
  "IMG-20251231-WA0112": ["A gift from the church", "Fellowship", "A gift handed to one of the children."],
  "IMG-20251231-WA0120": ["Giving and receiving", "Fellowship", "Two men sharing a gift."],
  "IMG-20251231-WA0122": ["A gift for a young woman", "Fellowship", "A young woman receiving a gift."],
  "IMG-20251231-WA0124": ["Giving thanks together", "Fellowship", "A gift exchanged with thanks."],
  "IMG-20251231-WA0130": ["A handshake and a gift", "Fellowship", "Greeting one another while sharing a gift."],
  "IMG-20251231-WA0136": ["Hands lifted", "Congregation", "The whole church with hands raised in worship."],
}

const videoCatalog = {
  "VID-20251231-WA0037": ["Worship gathering", "A moment from the church gathering."],
  "VID-20251231-WA0038": ["Praise and worship", "Praise during the church gathering."],
  "VID-20251231-WA0040": ["Congregational worship", "The church worshiping together."],
  "VID-20251231-WA0041": ["A song in the sanctuary", "Singing in the sanctuary."],
  "VID-20251231-WA0042": ["Leading worship", "Worship led from the front."],
  "VID-20251231-WA0043": ["The church at praise", "Praise from the gathered church."],
  "VID-20251231-WA0134": ["Hands raised in worship", "The congregation with hands raised."],
  "VID-20260101-WA0012": ["New Year worship", "Worship as the new year begins."],
  "VID-20260101-WA0014": ["New Year praise", "Praise during the New Year gathering."],
  "VID-20260101-WA0015": ["New Year gathering", "The church gathered for the New Year."],
  "VID-20260201-WA0014": ["February gathering", "A gathering of the church."],
}

function dateFromName(name) {
  const match = name.match(/(?:IMG|VID)-(\d{4})(\d{2})(\d{2})/)
  if (!match) return null
  return `${match[1]}-${match[2]}-${match[3]}`
}

function stem(filename) {
  return filename.replace(/\.[^.]+$/, "")
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is not set")

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString)
const pool = new Pool({
  connectionString,
  ssl: isLocal ? undefined : { rejectUnauthorized: false },
})
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const files = (await readdir(galleryDir)).sort()
const photos = []
const videos = []

for (const filename of files) {
  const key = stem(filename)
  const date = dateFromName(filename)
  const url = `/images/gallery/${filename}`
  if (/\.(jpe?g|png|webp)$/i.test(filename)) {
    const details = photoCatalog[key]
    if (!details) throw new Error(`No photo details for ${filename}`)
    photos.push({ title: details[0], category: details[1], description: details[2], url, date })
  } else if (/\.(mp4|webm|mov|m4v)$/i.test(filename)) {
    const details = videoCatalog[key]
    if (!details) throw new Error(`No video details for ${filename}`)
    videos.push({ title: details[0], description: details[1], url, date })
  }
}

const removedPhotos = await prisma.photo.deleteMany()
const removedVideos = await prisma.video.deleteMany()

const base = Date.now()
for (let index = 0; index < photos.length; index += 1) {
  await prisma.photo.create({
    data: { ...photos[index], createdAt: new Date(base + index * 1000) },
  })
}
for (let index = 0; index < videos.length; index += 1) {
  await prisma.video.create({
    data: { ...videos[index], createdAt: new Date(base + (photos.length + index) * 1000) },
  })
}

await rm(duplicateDir, { recursive: true, force: true })

console.log(`Removed ${removedPhotos.count} photos and ${removedVideos.count} videos.`)
console.log(`Added ${photos.length} photos and ${videos.length} videos from public/images/gallery.`)

await prisma.$disconnect()
await pool.end()
