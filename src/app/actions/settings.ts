'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { saveFile, deleteFile } from '@/lib/file-upload'

function extractIframeSrc(input: string) {
  const match = input.match(/src\s*=\s*["']([^"']+)["']/i)
  return match?.[1] || null
}

function normalizeGoogleMapsEmbedUrl(input: string | null | undefined) {
  const raw = String(input || "").trim()
  if (!raw) return null

  const fromIframe = raw.includes("<iframe") ? extractIframeSrc(raw) : null
  const value = (fromIframe || raw).trim()
  if (!value) return null

  if (!/^https?:\/\//i.test(value)) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(value)}&output=embed`
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }

  const host = url.hostname.toLowerCase()

  if (host === "maps.app.goo.gl" || host.endsWith(".app.goo.gl") || host === "goo.gl") {
    return null
  }

  const isGoogleHost =
    host === "google.com" ||
    host.endsWith(".google.com") ||
    host === "maps.google.com" ||
    host.endsWith(".googleusercontent.com")

  if (!isGoogleHost) {
    return null
  }

  if (url.pathname.includes("/maps/embed") || url.searchParams.get("output") === "embed") {
    return url.toString()
  }

  const coordMatch = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  const lat = coordMatch?.[1]
  const lng = coordMatch?.[2]

  let query = url.searchParams.get("q") || url.searchParams.get("query") || ""

  if (!query) {
    const placeMatch = url.pathname.match(/\/place\/([^/]+)/)
    if (placeMatch?.[1]) {
      query = decodeURIComponent(placeMatch[1].replace(/\+/g, " "))
    } else if (lat && lng) {
      query = `${lat},${lng}`
    }
  }

  query = query.trim()
  if (!query) return null

  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
}

let __cacheSettings: any = null
let __cacheSettingsAt = 0
let __cacheLocations: any[] | null = null
let __cacheLocationsAt = 0
const __ttl = 60000
const __defaultLocations = [
  {
    name: "Cabang Temayang",
    address: "Jl. Raya Temayang, Bojonegoro (Depan Pasar Temayang)",
    mapUrl: "https://maps.google.com/maps?q=Temayang,Bojonegoro&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "Cabang Kalitidu",
    address: "Jl. Raya Bojonegoro - Cepu, Kalitidu (Dekat Polsek Kalitidu)",
    mapUrl: "https://maps.google.com/maps?q=Kalitidu,Bojonegoro&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
]

// --- General Settings (WhatsApp & About) ---

export async function getSiteSettings() {
  if (__cacheSettings && Date.now() - __cacheSettingsAt < __ttl) {
    return __cacheSettings
  }
  try {
    const settings = await prisma.sitesettings.findFirst()
    if (settings) {
      __cacheSettings = {
        ...settings,
        googleMapsUrl: normalizeGoogleMapsEmbedUrl((settings as any).googleMapsUrl),
      }
      __cacheSettingsAt = Date.now()
      return __cacheSettings
    }

    // Fallback: Try raw query with lowercase table
    const rawSettings = await prisma.$queryRaw<any[]>`SELECT * FROM sitesettings LIMIT 1`
    if (rawSettings && rawSettings.length > 0) {
      __cacheSettings = {
        ...rawSettings[0],
        googleMapsUrl: normalizeGoogleMapsEmbedUrl(rawSettings[0]?.googleMapsUrl),
      }
      __cacheSettingsAt = Date.now()
      return __cacheSettings
    }
  } catch (error) {
    console.error("Failed to fetch site settings:", error)
    // Try raw query as last resort in catch block
    try {
      const rawSettings = await prisma.$queryRaw<any[]>`SELECT * FROM sitesettings LIMIT 1`
      if (rawSettings && rawSettings.length > 0) {
        __cacheSettings = {
          ...rawSettings[0],
          googleMapsUrl: normalizeGoogleMapsEmbedUrl(rawSettings[0]?.googleMapsUrl),
        }
        __cacheSettingsAt = Date.now()
        return __cacheSettings
      }
    } catch (e) {
      console.error("Raw query for sitesettings also failed:", e)
    }
  }

  const fallback = {
    whatsappNumber: "6281234567890",
    confirmationAdminContactId: null,
    aboutTitle: "Tentang SayEquipment",
    aboutDescription: "",
    heroBackgroundImage: null,
    aboutBackgroundImage: null,
    address: null,
    googleMapsUrl: null,
    operationalHours: null,
    instagram: null
  }
  __cacheSettings = fallback
  __cacheSettingsAt = Date.now()
  return fallback
}

export async function updateContactSettings(data: {
  whatsappNumber: string
  address: string
  googleMapsUrl: string
  operationalHours: string
  instagram: string
  confirmationAdminContactId?: string | null
}) {
  const normalizedMapsUrl = normalizeGoogleMapsEmbedUrl(data.googleMapsUrl)

  if (String(data.googleMapsUrl || "").trim() && !normalizedMapsUrl) {
    throw new Error("URL Google Maps tidak bisa di-embed. Gunakan link dari 'Embed a map' atau masukkan alamat/koordinat.")
  }

  const confirmationAdminContactId = String(data.confirmationAdminContactId || "").trim() || null

  const settings = await prisma.sitesettings.findFirst()
  
  if (settings) {
    await prisma.sitesettings.update({
      where: { id: settings.id },
      data: {
        whatsappNumber: data.whatsappNumber,
        address: data.address,
        googleMapsUrl: normalizedMapsUrl,
        operationalHours: data.operationalHours,
        instagram: data.instagram,
        confirmationAdminContactId,
        updatedAt: new Date()
      }
    })
  } else {
    await prisma.sitesettings.create({
      data: {
        id: crypto.randomUUID(),
        ...data,
        googleMapsUrl: normalizedMapsUrl,
        confirmationAdminContactId,
        updatedAt: new Date()
      }
    })
  }
  __cacheSettings = null
  __cacheSettingsAt = 0
  revalidatePath('/cart')
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/admin/settings')
}

// Deprecated: use updateContactSettings instead
export async function updateWhatsappNumber(number: string) {
  return updateContactSettings({
    whatsappNumber: number,
    address: "",
    googleMapsUrl: "",
    operationalHours: "",
    instagram: "",
    confirmationAdminContactId: null
  })
}

export async function updateAboutInfo(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  const settings = await prisma.sitesettings.findFirst()
  
  let imagePath = undefined
  if (imageFile && imageFile.size > 0) {
    if (settings?.aboutBackgroundImage) {
      await deleteFile(settings.aboutBackgroundImage)
    }
    imagePath = await saveFile(imageFile)
  }

  if (settings) {
    await prisma.sitesettings.update({
      where: { id: settings.id },
      data: { 
        aboutTitle: title,
        aboutDescription: description,
        ...(imagePath && { aboutBackgroundImage: imagePath }),
        updatedAt: new Date()
      }
    })
  } else {
    await prisma.sitesettings.create({
      data: { 
        id: crypto.randomUUID(),
        aboutTitle: title,
        aboutDescription: description,
        aboutBackgroundImage: imagePath,
        updatedAt: new Date()
      }
    })
  }
  __cacheSettings = null
  __cacheSettingsAt = 0
  revalidatePath('/about')
  revalidatePath('/admin/settings')
}

export async function updateHeroInfo(formData: FormData) {
  const imageFile = formData.get('image') as File
  
  if (!imageFile || imageFile.size === 0) {
    return
  }

  const settings = await prisma.sitesettings.findFirst()
  
  let imagePath = undefined
  if (settings?.heroBackgroundImage) {
    await deleteFile(settings.heroBackgroundImage)
  }
  imagePath = await saveFile(imageFile)

  if (settings) {
    await prisma.sitesettings.update({
      where: { id: settings.id },
      data: { 
        heroBackgroundImage: imagePath,
        updatedAt: new Date()
      }
    })
  } else {
    await prisma.sitesettings.create({
      data: { 
        id: crypto.randomUUID(),
        heroBackgroundImage: imagePath,
        updatedAt: new Date()
      }
    })
  }
  __cacheSettings = null
  __cacheSettingsAt = 0
  revalidatePath('/')
  revalidatePath('/admin/settings')
}

// --- Locations ---

export async function getLocations() {
  if (__cacheLocations && Date.now() - __cacheLocationsAt < __ttl) {
    return __cacheLocations
  }
  try {
    const rows = await prisma.location.findMany({
      orderBy: { createdAt: 'asc' }
    })
    if (rows.length === 0) {
      const now = new Date()
      await prisma.location.createMany({
        data: __defaultLocations.map((loc) => ({
          id: crypto.randomUUID(),
          name: loc.name,
          address: loc.address,
          mapUrl: loc.mapUrl,
          updatedAt: now,
        })),
      })

      const seeded = await prisma.location.findMany({
        orderBy: { createdAt: "asc" },
      })
      __cacheLocations = seeded
      __cacheLocationsAt = Date.now()
      return seeded
    }

    __cacheLocations = rows
    __cacheLocationsAt = Date.now()
    return rows
  } catch (error) {
    console.error("Failed to fetch locations:", error)
    try {
      const rows = await prisma.$queryRaw<any[]>`SELECT * FROM location ORDER BY createdAt ASC`
      __cacheLocations = rows
      __cacheLocationsAt = Date.now()
      return rows
    } catch (e) {
      console.error("Raw query for location failed:", e)
      return []
    }
  }
}

export async function createLocation(data: { name: string, address: string, mapUrl: string }) {
  await prisma.location.create({
    data: {
      ...data,
      id: crypto.randomUUID(),
      updatedAt: new Date()
    }
  })
  __cacheLocations = null
  __cacheLocationsAt = 0
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/admin/settings')
}

export async function updateLocation(id: string, data: { name: string, address: string, mapUrl: string }) {
  await prisma.location.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date()
    }
  })
  __cacheLocations = null
  __cacheLocationsAt = 0
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/admin/settings')
}

export async function deleteLocation(id: string) {
  await prisma.location.delete({
    where: { id }
  })
  __cacheLocations = null
  __cacheLocationsAt = 0
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/admin/settings')
}

// Helper for backward compatibility
export async function getWhatsappNumber() {
  const settings = await getSiteSettings()
  return settings.whatsappNumber
}
