import { getSiteSettings, getLocations } from "@/app/actions/settings"
import { getAdminContacts } from "@/app/actions/admin-contacts"
import { SettingsForm } from "@/components/admin/settings-form"
import { AboutForm } from "@/components/admin/about-form"
import { HeroForm } from "@/components/admin/hero-form"
import { LocationManager } from "@/components/admin/location-manager"
import { AdminContactManager } from "@/components/admin/admin-contact-manager"

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings()
  const locations = await getLocations()
  const adminContacts = await getAdminContacts()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
        <p className="text-gray-500 mt-1">Kelola konfigurasi dasar website.</p>
      </div>

      <div className="grid gap-12">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Tampilan Halaman Utama</h2>
          <HeroForm initialImage={settings.heroBackgroundImage} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Halaman Tentang Kami</h2>
          <AboutForm 
            initialTitle={settings.aboutTitle} 
            initialDescription={settings.aboutDescription || ""} 
            initialImage={settings.aboutBackgroundImage}
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Kontak & Checkout</h2>
          <div className="space-y-8">
            <SettingsForm 
              initialNumber={settings.whatsappNumber}
              initialConfirmationAdminContactId={(settings as any).confirmationAdminContactId}
              adminContacts={adminContacts}
              initialAddress={settings.address}
              initialMapsUrl={settings.googleMapsUrl}
              initialHours={settings.operationalHours}
              initialInstagram={settings.instagram}
            />
            <AdminContactManager contacts={adminContacts} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Lokasi Cabang</h2>
          <LocationManager locations={locations} />
        </section>
      </div>
    </div>
  )
}
