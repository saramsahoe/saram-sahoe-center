import { getNewsSlides } from "@/app/actions/news"
import { getMyProfile } from "@/app/actions/profile"
import { ContactSection } from "@/components/home/contact-section"
import { IntroGrid } from "@/components/home/intro-grid"
import { NewsCarousel } from "@/components/home/news-carousel"
import { VisionHero } from "@/components/home/vision-hero"

export default async function Page() {
  const [slides, profile] = await Promise.all([getNewsSlides(), getMyProfile()])
  const isAdmin = profile?.role === "admin"

  return (
    <>
      <VisionHero />
      <NewsCarousel initialSlides={slides ?? []} isAdmin={isAdmin} />
      <IntroGrid />
      <ContactSection />
    </>
  )
}
