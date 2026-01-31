import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const siteConfig: SiteConfig = {
  name: "BiriVibe OS",
  author: "Gabriel Panazio",
  description:
    "Life Operating System - Track habits, diet, fitness, and more.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Life OS",
    "Habits",
    "Diet",
    "Fitness",
    "Quantified Self",
  ],
  url: {
    base: baseUrl,
    author: "https://birivibe.com",
  },
  links: {
    github: "https://github.com/Gpanazio/birivibe",
  },
  ogImage: `${baseUrl}/og.jpg`,
}
