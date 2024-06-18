/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import Papa from 'papaparse'

const AIRCON_FILES = [
  'prisma/data/NEA_ELS_Air_Conditioner_2024-06-16_152037.csv',
  'prisma/data/NEA_ELS_AirConditioner(3-Phase)_2024-06-16_152052.csv',
]

const prisma = new PrismaClient()

async function main() {
  for (const file of AIRCON_FILES) {
    Papa.parse(fs.createReadStream(file), {
      delimiter: ',',
      header: true,
      dynamicTyping: true,
      comments: '#',
      skipEmptyLines: true,
      chunk: async (results: { data: any[]; errors: any[]; meta: {} }) => {
        const errorRows = results.errors.map((error) => error.row)
        const records = results.data
          .map((row, index) => {
            if (errorRows.includes(index)) {
              return null
            }
            const aircon = {
              brand: row['Brand']?.trim(),
              model: row['Model']?.trim(),
              greenTicks: Number(row['Green Ticks']),
              annualConsumption: Number(row['Annual Energy Consumption (kWh)']),
            }
            return aircon
          })
          .filter((aircon) => aircon != null)
        console.log(`Inserting ${records.length} records`)
        await prisma.aircon.createMany({ data: records, skipDuplicates: true })
      },
      chunkSize: 100,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
