import { AboutSection } from '../components/layout/AboutSection'
import { ContactSection } from '../components/layout/ContactSection'
import { Hero } from '../components/layout/Hero'
import { SkillsSection } from '../components/layout/SkillsSection'
import { TimelineSection } from '../components/layout/TimelineSection'
import { ProjectsSection } from '../components/projects/ProjectsSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <TimelineSection />
      <ContactSection />
    </>
  )
}
