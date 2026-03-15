
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Checking if name column exists in Admin table...")
    // Try to select the column
    try {
      await prisma.$queryRaw`SELECT name FROM admin LIMIT 1`
      console.log("Column name already exists.")
    } catch (e) {
      console.log("Column name does not exist. Adding it...")
      // Add column
      await prisma.$executeRaw`ALTER TABLE admin ADD COLUMN name VARCHAR(255) DEFAULT 'Admin'`
      console.log("Column name added successfully.")
    }
    
  } catch (error) {
    console.error("Error updating schema:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
