import { ContactSection } from "@/components/home/contact-section"
import { IntroGrid } from "@/components/home/intro-grid"
import { NewsCarousel } from "@/components/home/news-carousel"
import { VisionHero } from "@/components/home/vision-hero"

export default function Page() {
  return (
    <>
      <VisionHero />
      <NewsCarousel />
      <IntroGrid />
      <ContactSection />
    </>
  )
}
