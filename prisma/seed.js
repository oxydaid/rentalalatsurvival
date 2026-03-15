const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const products = [
  {
    name: "Tenda Kap. 4-5 Double Layer",
    description: "Tenda camping kapasitas 4-5 orang, double layer, tahan hujan dan angin. Cocok untuk keluarga atau grup kecil.",
    price1Day: 30000,
    price2Days: 55000,
    price3Days: 80000,
    priceOver3Days: 25000,
    stock: 5,
    category: "Tenda",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
  },
  {
    name: "Tenda Kap. 3-4 Double Layer",
    description: "Tenda camping kapasitas 3-4 orang, double layer, nyaman untuk grup kecil.",
    price1Day: 25000,
    price2Days: 45000,
    price3Days: 65000,
    priceOver3Days: 20000,
    stock: 5,
    category: "Tenda",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
  },
  {
    name: "Tenda Kap. 2-3 Double Layer",
    description: "Tenda camping kapasitas 2-3 orang, double layer, cocok untuk pasangan atau solo camper.",
    price1Day: 20000,
    price2Days: 35000,
    price3Days: 50000,
    priceOver3Days: 15000,
    stock: 5,
    category: "Tenda",
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80"
  },
  {
    name: "Tenda Kap. 2-3 Single Layer",
    description: "Tenda camping kapasitas 2-3 orang, single layer, ringan dan praktis untuk cuaca cerah.",
    price1Day: 15000,
    price2Days: 25000,
    price3Days: 35000,
    priceOver3Days: 10000,
    stock: 5,
    category: "Tenda",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80"
  },
  {
    name: "Carrier (50, 60, 80 Liter)",
    description: "Tas gunung carrier ukuran besar (50-80L) dengan backsystem nyaman untuk pendakian panjang.",
    price1Day: 20000,
    price2Days: 35000,
    price3Days: 50000,
    priceOver3Days: 15000,
    stock: 10,
    category: "Tas & Carrier",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
  },
  {
    name: "Daypack (25-30 Liter)",
    description: "Tas punggung daypack ukuran sedang (25-30L) untuk hiking sehari atau traveling ringan.",
    price1Day: 15000,
    price2Days: 25000,
    price3Days: 35000,
    priceOver3Days: 10000,
    stock: 10,
    category: "Tas & Carrier",
    image: "https://images.unsplash.com/photo-1581605405669-fcdf8116543f?w=800&q=80"
  },
  {
    name: "Headlamp Charger",
    description: "Lampu kepala dengan baterai isi ulang (charger). Terang, praktis, dan tahan lama.",
    price1Day: 7000,
    price2Days: 12000,
    price3Days: 18000,
    priceOver3Days: 5000,
    stock: 10,
    category: "Penerangan",
    image: "https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=800&q=80"
  },
  {
    name: "Lampu Tenda (Tenaga Powerbank)",
    description: "Lampu gantung untuk tenda, menggunakan tenaga powerbank (USB). Hemat energi.",
    price1Day: 5000,
    price2Days: 8000,
    price3Days: 10000,
    priceOver3Days: 3000,
    stock: 10,
    category: "Penerangan",
    image: "https://images.unsplash.com/photo-1534800891164-a1d96b5114e7?w=800&q=80"
  },
  {
    name: "Kompor Portable Non Windproof",
    description: "Kompor portable standar untuk memasak di alam bebas. Mudah digunakan.",
    price1Day: 7000,
    price2Days: 12000,
    price3Days: 18000,
    priceOver3Days: 5000,
    stock: 10,
    category: "Masak",
    image: "https://images.unsplash.com/photo-1584985695020-22d73356073b?w=800&q=80"
  },
  {
    name: "Kompor Portable Windproof",
    description: "Kompor portable dengan pelindung angin (windproof) agar api tetap stabil saat angin kencang.",
    price1Day: 10000,
    price2Days: 18000,
    price3Days: 25000,
    priceOver3Days: 7000,
    stock: 10,
    category: "Masak",
    image: "https://images.unsplash.com/photo-1545652579-247656972236?w=800&q=80"
  },
  {
    name: "Matras Spons/Cacing",
    description: "Matras gulung standar untuk alas tidur di dalam tenda. Ringan dan isolator yang baik.",
    price1Day: 5000,
    price2Days: 8000,
    price3Days: 10000,
    priceOver3Days: 3000,
    stock: 20,
    category: "Perlengkapan Tidur",
    image: "https://images.unsplash.com/photo-1517840933437-c713c263f945?w=800&q=80"
  },
  {
    name: "Matras Foil (2P)",
    description: "Matras aluminium foil ukuran 2 orang, sangat efektif menahan suhu dingin dari tanah.",
    price1Day: 7000,
    price2Days: 12000,
    price3Days: 16000,
    priceOver3Days: 5000,
    stock: 10,
    category: "Perlengkapan Tidur",
    image: "https://images.unsplash.com/photo-1628080603780-69255018659d?w=800&q=80"
  },
  {
    name: "Sleeping Bag",
    description: "Kantong tidur hangat model mummy/tikus, nyaman untuk suhu pegunungan.",
    price1Day: 10000,
    price2Days: 18000,
    price3Days: 25000,
    priceOver3Days: 7000,
    stock: 15,
    category: "Perlengkapan Tidur",
    image: "https://images.unsplash.com/photo-1627662236965-4d7a71f021c3?w=800&q=80"
  },
  {
    name: "Tracking Pole/Tongkat Gunung",
    description: "Tongkat bantu jalan (trekking pole) untuk menjaga keseimbangan dan mengurangi beban kaki.",
    price1Day: 8000,
    price2Days: 15000,
    price3Days: 20000,
    priceOver3Days: 5000,
    stock: 10,
    category: "Aksesoris",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80"
  },
  {
    name: "Nesting/Cooking Set 4-5 P",
    description: "Set alat masak lengkap (panci, wajan) ukuran besar untuk 4-5 orang.",
    price1Day: 12000,
    price2Days: 18000,
    price3Days: 25000,
    priceOver3Days: 7000,
    stock: 5,
    category: "Masak",
    image: "https://images.unsplash.com/photo-1576510826017-e25f8221805b?w=800&q=80"
  },
  {
    name: "Nesting/Cooking Set 2-3 P",
    description: "Set alat masak compact (panci, wajan) untuk 2-3 orang. Ringan dan mudah dibawa.",
    price1Day: 8000,
    price2Days: 15000,
    price3Days: 20000,
    priceOver3Days: 5000,
    stock: 5,
    category: "Masak",
    image: "https://images.unsplash.com/photo-1498522271744-cdd43b99e3cc?w=800&q=80"
  },
  {
    name: "Hammock/Ayunan Gantung",
    description: "Ayunan gantung santai (hammock), sudah termasuk tali webbing kuat.",
    price1Day: 7000,
    price2Days: 12000,
    price3Days: 18000,
    priceOver3Days: 5000,
    stock: 10,
    category: "Aksesoris",
    image: "https://images.unsplash.com/photo-1544979590-37e9b47cd705?w=800&q=80"
  },
  {
    name: "Flysheet/Penutup Tenda",
    description: "Kain pelindung tambahan (flysheet) anti air untuk atap tenda atau bivak darurat.",
    price1Day: 10000,
    price2Days: 18000,
    price3Days: 25000,
    priceOver3Days: 7000,
    stock: 10,
    category: "Tenda",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
  },
  {
    name: "Jerigen Lipat 5 Liter",
    description: "Wadah air lipat kapasitas 5 liter, praktis dan hemat tempat saat tidak digunakan.",
    price1Day: 5000,
    price2Days: 8000,
    price3Days: 10000,
    priceOver3Days: 3000,
    stock: 10,
    category: "Aksesoris",
    image: "https://images.unsplash.com/photo-1534067783941-51c9c2363090?w=800&q=80"
  },
  {
    name: "Sepatu Outdoor / Trail Run",
    description: "Sepatu gunung/hiking yang kuat, anti slip, dan nyaman di medan berat.",
    price1Day: 15000,
    price2Days: 25000,
    price3Days: 35000,
    priceOver3Days: 10000,
    stock: 10,
    category: "Sepatu & Pakaian",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
  },
  {
    name: "Sewa Tabung + Isi Gas",
    description: "Tabung gas portable (Hi-Cook) beserta isinya. Tabung wajib dikembalikan.",
    price1Day: 10000,
    price2Days: 18000,
    price3Days: 25000,
    priceOver3Days: 7000,
    stock: 20,
    category: "Masak",
    image: "https://images.unsplash.com/photo-1624821588855-a026e63d373f?w=800&q=80"
  },
  {
    name: "Refill/Isi Ulang Gas",
    description: "Jasa isi ulang gas portable dengan sistem tukar tabung kosong.",
    price1Day: 8000,
    price2Days: 15000,
    price3Days: 20000,
    priceOver3Days: 6000,
    stock: 50,
    category: "Masak",
    image: "https://images.unsplash.com/photo-1624821588855-a026e63d373f?w=800&q=80"
  },
  {
    name: "Egg Holder (Kap 12)",
    description: "Tempat telur plastik kapasitas 12 butir, menjaga telur aman dari benturan.",
    price1Day: 5000,
    price2Days: 8000,
    price3Days: 10000,
    priceOver3Days: 3000,
    stock: 5,
    category: "Masak",
    image: "https://images.unsplash.com/photo-1582883656903-51834927b878?w=800&q=80"
  },
  {
    name: "Sekop Portable",
    description: "Sekop lipat kecil multifungsi, bisa untuk menggali parit air di sekitar tenda.",
    price1Day: 5000,
    price2Days: 8000,
    price3Days: 10000,
    priceOver3Days: 3000,
    stock: 5,
    category: "Aksesoris",
    image: "https://images.unsplash.com/photo-1445307906981-28b278c53260?w=800&q=80"
  },
  {
    name: "Set Kursi + Meja Outdoor",
    description: "Paket 1 Meja Lipat + 2 Kursi Lipat. Cocok untuk bersantai menikmati pemandangan.",
    price1Day: 40000,
    price2Days: 75000,
    price3Days: 110000,
    priceOver3Days: 30000,
    stock: 3,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&q=80"
  },
  {
    name: "Jaket Outdoor",
    description: "Jaket gunung waterproof dan windproof, menjaga tubuh tetap hangat.",
    price1Day: 15000,
    price2Days: 25000,
    price3Days: 35000,
    priceOver3Days: 10000,
    stock: 5,
    category: "Sepatu & Pakaian",
    image: "https://images.unsplash.com/photo-1548863227-3af567720244?w=800&q=80"
  },
  {
    name: "Lampu Tumblr 10 M",
    description: "Lampu hias tumblr panjang 10 meter, tenaga USB/Powerbank. Mempercantik suasana tenda.",
    price1Day: 10000,
    price2Days: 18000,
    price3Days: 25000,
    priceOver3Days: 7000,
    stock: 5,
    category: "Penerangan",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
  }
]

const faqs = [
  {
    question: "Apa saja syarat untuk menyewa?",
    answer: "Syarat utama adalah meninggalkan kartu identitas asli (KTP/SIM/KTM) sebagai jaminan selama masa sewa. Jika tidak ada identitas asli, bisa menggunakan deposit uang tunai sesuai nilai barang.",
  },
  {
    question: "Apakah bisa booking tanpa DP?",
    answer: "Untuk memastikan ketersediaan barang, kami mewajibkan DP (Down Payment) minimal 50% dari total biaya sewa. Booking tanpa DP tidak mengikat dan barang bisa disewa orang lain.",
  },
  {
    question: "Apakah menyediakan layanan antar-jemput (delivery)?",
    answer: "Ya, kami menyediakan layanan delivery dengan ongkos kirim menyesuaikan jarak dari lokasi kami. Silakan hubungi admin untuk cek tarif ongkir ke lokasi Anda.",
  },
  {
    question: "Bagaimana perhitungan durasi sewanya?",
    answer: "Hitungan sewa adalah per 24 jam. Contoh: Jika ambil barang Sabtu jam 10.00, maka pengembalian maksimal Minggu jam 10.00. Keterlambatan akan dikenakan denda sesuai tarif yang berlaku.",
  },
  {
    question: "Bagaimana jika barang yang disewa rusak atau hilang?",
    answer: "Penyewa bertanggung jawab penuh atas barang yang disewa. Jika terjadi kerusakan atau kehilangan, penyewa wajib mengganti biaya perbaikan atau penggantian unit baru sesuai harga pasar.",
  },
  {
    question: "Apakah peralatan sudah bersih saat disewa?",
    answer: "Tentu! Kami menjamin semua peralatan (tenda, sleeping bag, alat masak, dll) sudah dicuci bersih dan dicek kondisinya sebelum diserahkan kepada penyewa.",
  },
]

const rentalTerms = [
  {
    content: "1. Jaminan Identitas\nWajib Meninggalkan jaminan asli berupa SIM, KTP, Fotocopy KK, atau identitas resmi sejenisnya.",
  },
  {
    content: "2. Cek Kondisi Alat\nCek kelengkapan dan kondisi alat sebelum dibawa serta saat pengembalian. Pastikan semua berfungsi baik.",
  },
  {
    content: "3. Waktu & Layanan\n- Melayani COD (menyesuaikan kesepakatan).\n- Layanan 24 jam (Konfirmasi via WA dulu).\n- Perhitungan 1 hari = 24 jam, dari jam berangkat.\nSimulasi:\n- 1 Hari (24 jam): Senin sore - Selasa sore\n- 2 Hari (48 jam): Senin sore - Rabu sore\n*Ambil siang tapi berangkat sore? Dihitung sore. Berangkat pagi? Boleh ambil malam sebelumnya.",
  },
  {
    content: "4. Keterlambatan\nFree time 4 jam diluar jam sewa untuk pengembalian alat.\nDenda Keterlambatan:\n- Charge 15% dari total sewa (jika terlambat di hari yang sama / >4 jam).\n- Full charge total sewa (jika kembali di hari berbeda).",
  },
  {
    content: "5. Kerusakan Alat\nKerusakan alat ditanggung bersama (50% : 50%).\n*Penyewa cukup membayar 50% dari nominal kerusakan.",
  },
  {
    content: "6. Promo & Lainnya\n- Sewa nominal besar? Ada harga khusus!",
  },
]

const bookingSteps = [
  {
    title: "1. Pilih Barang",
    description: "Cari perlengkapan camping yang Anda butuhkan di katalog kami. Cek spesifikasi dan harga sewa.",
    icon: "Search",
    stepOrder: 1,
  },
  {
    title: "2. Konfirmasi Stok",
    description: "Hubungi admin via WhatsApp untuk memastikan ketersediaan barang pada tanggal yang Anda inginkan.",
    icon: "MessageCircle",
    stepOrder: 2,
  },
  {
    title: "3. Isi Data & Bayar",
    description: "Isi formulir pemesanan dan lakukan pembayaran DP (Down Payment) atau pelunasan untuk mengamankan booking.",
    icon: "CreditCard",
    stepOrder: 3,
  },
  {
    title: "4. Ambil / Delivery",
    description: "Ambil barang di lokasi kami atau gunakan layanan delivery. Jangan lupa bawa KTP sebagai jaminan.",
    icon: "PackageCheck",
    stepOrder: 4,
  },
  {
    title: "5. Kembalikan",
    description: "Nikmati liburan Anda! Kembalikan barang sesuai jadwal dalam kondisi bersih dan baik.",
    icon: "Smile",
    stepOrder: 5,
  },
]

async function main() {
  console.log('Start seeding...')

  // Products
  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    })
    
    if (!existingProduct) {
      const p = await prisma.product.create({
        data: product,
      })
      console.log(`Created product with id: ${p.id}`)
    } else {
        await prisma.product.update({
            where: { id: existingProduct.id },
            data: product
        })
        console.log(`Updated product: ${product.name}`)
    }
  }

  // FAQs
  for (const faq of faqs) {
    const existingFAQ = await prisma.faq.findFirst({
      where: { question: faq.question }
    })

    if (!existingFAQ) {
      await prisma.faq.create({ data: faq })
      console.log(`Created FAQ: ${faq.question}`)
    }
  }

  // Rental Terms
  // Note: RentalTerm doesn't have a unique field like 'name' or 'question', so we might duplicate if we run multiple times.
  // We'll just check if *any* terms exist, if not, we seed.
  const existingTerms = await prisma.rentalterm.count()
  if (existingTerms === 0) {
    for (const term of rentalTerms) {
      await prisma.rentalterm.create({ data: term })
      console.log(`Created Rental Term: ${term.content.substring(0, 20)}...`)
    }
  } else {
    console.log("Rental Terms already exist, skipping...")
  }

  // Booking Steps
  for (const step of bookingSteps) {
    const existingStep = await prisma.bookingstep.findFirst({
      where: { title: step.title }
    })

    if (!existingStep) {
      await prisma.bookingstep.create({ data: step })
      console.log(`Created Booking Step: ${step.title}`)
    }
  }

  // Site Settings
  const existingSettings = await prisma.sitesettings.findFirst()
  if (!existingSettings) {
    await prisma.sitesettings.create({
      data: {
        whatsappNumber: "6281234567890"
      }
    })
    console.log("Created default Site Settings")
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
