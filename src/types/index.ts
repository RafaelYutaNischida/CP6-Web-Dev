export interface GithubRepo {
  id: number
  name: string
  description: string | null
  language: string | null
  updatedAt: string
  htmlUrl: string
  homepage: string | null
  stars: number
  topics: string[]
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  replied: boolean
  repliedAt: string | null
  createdAt: string
}

export interface AuthUser {
  id: string
  email: string
}

export interface TimelineItem {
  title: string
  organization: string
  period: string
  description?: string
}

export interface SkillGroup {
  group: string
  items: string[]
}

export interface SocialLink {
  label: string
  url: string
}

export interface SiteConfig {
  name: string
  role: string
  tagline: string
  bio: string[]
  email: string
  location: string
  avatar?: { src: string; width: number; height: number; alt: string }
  social: SocialLink[]
  skills: SkillGroup[]
  education: TimelineItem[]
  experience: TimelineItem[]
}
