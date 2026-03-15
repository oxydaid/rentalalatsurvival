
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Checking if isFeatured column exists...")
    // Try to select the column
    try {
      await prisma.$queryRaw`SELECT isFeatured FROM Product LIMIT 1`
      console.log("Column isFeatured already exists.")
    } catch (e) {
      console.log("Column isFeatured does not exist. Adding it...")
      // SQLite syntax to add column
      await prisma.$executeRaw`ALTER TABLE Product ADD COLUMN isFeatured BOOLEAN DEFAULT 0`
      console.log("Column isFeatured added successfully.")
    }

    // Also check if updatedAt column exists (it should, but good to verify)
    // In SQLite, we can't easily check columns without querying or PRAGMA
    
  } catch (error) {
    console.error("Error updating schema:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
