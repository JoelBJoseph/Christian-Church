import "dotenv/config"
import { copyFile, mkdir } from "fs/promises"
import path from "path"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const assetsDir = path.resolve(
  "C:/Users/HP/.cursor/projects/d-fun-christian-church-Christian-Church/assets",
)
const eventsDir = path.resolve("public/images/events")
const location =
  "Michael Anna Chamakkalayil Township, Supplyco Road, Muttom, Thodupuzha"

const events = [
  {
    file: "WhatsApp_Image_2026-10-26_at_10.47.01_PM-52e12fee-2316-4359-9ef7-a9943aadb318.jpg",
    name: "fasting-prayer-2024-10.jpg",
    title: "3 Days Fasting and Prayer",
    description: "10–12 October 2024. With Pr. Biju Joseph and Pr. Joy Parackal.",
    date: "2024-10-10",
    time: "10:00 AM",
  },
  {
    file: "WhatsApp_Image_2026-10-26_at_10.45.56_PM-c21d077c-5e78-4511-b92c-f646195e4415.jpg",
    name: "fasting-prayer-2025-02.jpg",
    title: "3 Days Fasting and Prayer",
    description:
      "24–26 February 2025. “Call to Me, and I will answer you” (Jeremiah 33:3). Speakers: Pastor Biju Joseph and Pastor Joseph P.T.",
    date: "2025-02-24",
    time: "10:00 AM",
  },
  {
    file: "WhatsApp_Image_2026-10-26_at_10.45.23_PM-1b4f749f-088a-4a87-96e7-2015412a90ea.jpg",
    name: "fasting-prayer-2025-04.jpg",
    title: "3 Days Fasting and Prayers",
    description: "16–18 April 2025. With Pr. Biju Joseph and Pr. Sineesh Sebastian.",
    date: "2025-04-16",
    time: "10:30 AM",
  },
  {
    file: "WhatsApp_Image_2026-10-26_at_10.44.55_PM-e8ad2362-efc1-4e0f-b62e-6c7f95f78293.jpg",
    name: "fasting-prayer-2025-07.jpg",
    title: "3 Days Fasting and Prayer",
    description: "10–12 July 2025. Ministering: Pr. Jinu Thankachan and Pr. Biju Joseph.",
    date: "2025-07-10",
    time: "10:00 AM",
  },
  {
    file: "WhatsApp_Image_2026-10-26_at_10.44.26_PM-7974783f-5d90-4761-b52e-4862ba03d155.jpg",
    name: "praise-worship-2025-12.jpg",
    title: "Praise and Worship",
    description: "Sunday praise and worship on 28 December 2025.",
    date: "2025-12-28",
    time: "9:00 AM – 12:00 PM",
  },
  {
    file: "WhatsApp_Image_2026-10-26_at_10.43.47_PM-5e20c939-0cde-4e32-a3df-8382e0027547.jpg",
    name: "fasting-prayer-2026-02.jpg",
    title: "3 Days Prayer and Fasting",
    description: "12–14 February 2026, 10 AM each day. With Pr. Saji Mathew.",
    date: "2026-02-12",
    time: "10:00 AM",
  },
  {
    file: "WhatsApp_Image_2026-10-26_at_10.43.29_PM-22dff8fc-9f9a-4e4c-8925-c405808b3a8b.jpg",
    name: "fasting-prayer-2026-04.jpg",
    title: "3 Days Prayer and Fasting",
    description: "1–3 April 2026, 10 AM each day. With Pr. Sam Thomas.",
    date: "2026-04-01",
    time: "10:00 AM",
  },
  {
    file: "WhatsApp_Image_2026-10-26_at_10.43.03_PM-85c9d20f-6dbd-46f1-96a0-62fc5986f195.jpg",
    name: "fasting-prayer-2026-08.jpg",
    title: "3 Days Prayer and Fasting",
    description: "6–8 August 2026. Guest speaker: Pastor Vijayakumar, with Pr. Biju Joseph.",
    date: "2026-08-06",
    time: "10:00 AM",
  },
]

await mkdir(eventsDir, { recursive: true })
for (const event of events) {
  await copyFile(path.join(assetsDir, event.file), path.join(eventsDir, event.name))
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is not set")

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString)
const pool = new Pool({
  connectionString,
  ssl: isLocal ? undefined : { rejectUnauthorized: false },
})
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const urls = events.map((event) => `/images/events/${event.name}`)
const removed = await prisma.event.deleteMany({ where: { imageUrl: { in: urls } } })

const base = Date.now()
for (let index = 0; index < events.length; index += 1) {
  const event = events[index]
  await prisma.event.create({
    data: {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location,
      imageUrl: `/images/events/${event.name}`,
      createdAt: new Date(base + index * 1000),
    },
  })
}

console.log(`Replaced ${removed.count} matching events and added ${events.length} events.`)
await prisma.$disconnect()
await pool.end()
