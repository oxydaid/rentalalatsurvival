
import { getLocations, getSiteSettings } from "@/app/actions/settings"
import { AboutContent } from "@/components/about/about-content"

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const locations = await getLocations()

  return <AboutContent settings={settings} locations={locations} />
}
