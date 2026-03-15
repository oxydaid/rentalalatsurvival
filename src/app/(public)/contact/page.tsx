
import { getSiteSettings, getLocations } from "@/app/actions/settings"
import { getAdminContacts } from "@/app/actions/admin-contacts"
import { ContactContent } from "@/components/contact/contact-content"

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const adminContacts = await getAdminContacts()
  const locations = await getLocations()

  return <ContactContent settings={settings} adminContacts={adminContacts} locations={locations} />
}
