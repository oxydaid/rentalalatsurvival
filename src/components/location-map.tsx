import { MapPin } from "lucide-react"

interface Location {
  id: string
  name: string
  address: string
  mapUrl: string
}

interface LocationMapProps {
  locations?: Location[]
}

export function LocationMap({ locations = [] }: LocationMapProps) {
  // Fallback if no locations are set
  const displayLocations = locations.length > 0 ? locations : [
    {
      id: "default-1",
      name: "Cabang Temayang (Default)",
      address: "Jl. Raya Temayang, Bojonegoro (Depan Pasar Temayang)",
      mapUrl: "https://maps.google.com/maps?q=Temayang,Bojonegoro&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    {
      id: "default-2",
      name: "Cabang Kalitidu (Default)",
      address: "Jl. Raya Bojonegoro - Cepu, Kalitidu (Dekat Polsek Kalitidu)",
      mapUrl: "https://maps.google.com/maps?q=Kalitidu,Bojonegoro&t=&z=15&ie=UTF8&iwloc=&output=embed"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-earth-800">Lokasi Kami</h2>
          <p className="text-earth-500 mt-2">Kunjungi cabang terdekat kami di Bojonegoro</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayLocations.map((loc) => (
            <div key={loc.id} className="bg-earth-50 rounded-2xl overflow-hidden shadow-sm border border-earth-100 flex flex-col">
              <div className="p-6 bg-primary-400">
                <div className="flex items-center space-x-3 text-earth-900">
                  <MapPin className="h-6 w-6" />
                  <h3 className="text-xl font-bold">{loc.name}</h3>
                </div>
                <p className="mt-2 text-earth-800 text-sm">
                  {loc.address}
                </p>
              </div>
              <div className="flex-grow min-h-[300px] w-full relative">
                <iframe 
                  src={loc.mapUrl}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
