const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      name: 'Tenda Dome 4 Person',
      description: 'Tenda dome kapasitas 4 orang, double layer, waterproof. Cocok untuk camping keluarga atau grup kecil.',
      price: 50000,
      stock: 10,
      category: 'Tenda',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    },
    {
      name: 'Carrier 60L',
      description: 'Tas gunung kapasitas 60 liter dengan backsystem nyaman. Sudah termasuk raincover.',
      price: 35000,
      stock: 15,
      category: 'Tas',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    },
    {
      name: 'Sleeping Bag Mummy',
      description: 'Sleeping bag model mummy, bahan polar hangat, limit suhu 10 derajat celcius.',
      price: 15000,
      stock: 20,
      category: 'Tidur',
      image: 'https://images.unsplash.com/photo-1629248457630-9b308e75294e?w=800&q=80',
    },
    {
      name: 'Matras Camping',
      description: 'Matras karet spon untuk alas tidur di dalam tenda.',
      price: 5000,
      stock: 30,
      category: 'Tidur',
      image: 'https://images.unsplash.com/photo-1616687428784-1c6460914488?w=800&q=80',
    },
    {
      name: 'Kompor Portable',
      description: 'Kompor lapangan portable anti angin. Belum termasuk gas.',
      price: 15000,
      stock: 10,
      category: 'Masak',
      image: 'https://images.unsplash.com/photo-1595231777053-9b308e75294e?w=800&q=80', // Placeholder
    },
    {
      name: 'Nesting / Cooking Set',
      description: 'Set alat masak camping (panci, wajan) bahan aluminium ringan.',
      price: 20000,
      stock: 10,
      category: 'Masak',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }
  
  // Create default admin
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'admin123' // In production use bcrypt
    }
  })

  console.log('Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
