/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { Nea, PrismaClient, Sale } from '@prisma/client'
import * as fs from 'fs'
import Papa from 'papaparse'

const NEA_FILES = [
  'prisma/data/NEA_ELS_Air_Conditioner_2024-06-16_152037.csv',
  'prisma/data/NEA_ELS_AirConditioner(3-Phase)_2024-06-16_152052.csv',
]

const SALES_FILES = ['prisma/data/sales.csv']

const prisma = new PrismaClient()

async function main() {
  await prisma.airconDetail.deleteMany()
  console.log('Deleted all airconDetail records')
  await prisma.aircon.deleteMany()
  console.log('Deleted all aircon records')
  await prisma.sale.deleteMany()
  console.log('Deleted all sale records')
  await prisma.nea.deleteMany()
  console.log('Deleted all nea records')

  const neas: Nea[] = []
  const sales: Sale[] = []

  // parse nea files into nea table
  for (const file of NEA_FILES) {
    const results: { data: any[]; errors: any[]; meta: {} } = Papa.parse(
      fs.readFileSync(file, 'utf-8'),
      {
        delimiter: ',',
        header: true,
        dynamicTyping: true,
        comments: '#',
        skipEmptyLines: true,
      },
    )
    const errorRows = results.errors.map((error) => error.row)
    const records = results.data
      .map((row, index) => {
        if (errorRows.includes(index)) {
          return null
        }
        const nea = {
          brand: row['Brand']?.trim(),
          model: row['Model']?.trim(),
          greenTicks: Number(row['Green Ticks']),
          annualConsumption: Number(row['Annual Energy Consumption (kWh)']),
        }
        return nea
      })
      .filter((nea) => nea != null) as Nea[]
    console.log(`Inserting ${records.length} neas`)
    await prisma.nea.createMany({ data: records, skipDuplicates: true })
    neas.push(...records)
  }

  // parse sales files into sale table
  for (const file of SALES_FILES) {
    const results: { data: any[]; errors: any[]; meta: {} } = Papa.parse(
      fs.readFileSync(file, 'utf-8'),
      {
        delimiter: ',',
        header: true,
        dynamicTyping: true,
        comments: '#',
        skipEmptyLines: true,
      },
    )
    const errorRows = results.errors.map((error) => error.row)
    const records = results.data
      .map((row, index) => {
        if (errorRows.includes(index)) {
          return null
        }
        const sale = {
          image: row['image']?.replace(/^['"]+|['"]+$/g, '').trim(),
          url: row['url']?.replace(/^['"]+|['"]+$/g, '').trim(),
          brandLogo: row['brandLogo']?.replace(/^['"]+|['"]+$/g, '').trim(),
          brandUrl: row['brandUrl']?.replace(/^['"]+|['"]+$/g, '').trim(),
          model: row['model']?.replace(/^['"]+|['"]+$/g, '').trim(),
          description: row['description']?.replace(/^['"]+|['"]+$/g, '').trim(),
          price: Math.round(parseFloat(row['price'])),

        }
        return sale
      })
      .filter((sale) => sale != null) as Sale[]
    console.log(`Inserting ${records.length} sales`)
    await prisma.sale.createMany({ data: records, skipDuplicates: true })
    sales.push(...records)
  }

  // join nea with sale into aircon table
  const aircons = (
    await Promise.all(
      neas.map(async (nea) => {
        const sale = await prisma.sale.findFirst({
          where: {
            model: {
              contains: nea.model,
            },
          },
        })
        if (sale == null) {
          return null
        }
        const name = sale.model.split(' ').slice(0, -1).join(' ')
        const btus = parseBtu(sale.description)
        return {
          name,
          brand: nea.brand,
          model: nea.model,
          greenTicks: nea.greenTicks,
          annualConsumption: nea.annualConsumption,
          price: sale.price,
          image: sale.image,
          brandLogo: sale.brandLogo,
          brandUrl: sale.brandUrl,
          airconDetail: {
            create: {
              url: sale.url,
              btus,
            },
          },
        }
      }),
    )
  ).filter((item) => item != null)
  console.log(`Inserting ${aircons.length} aircons`)

  aircons.forEach(async (item) => await prisma.aircon.create({ data: item }))
}

function parseBtu(s: string) {
  s = s.toUpperCase().split('BTU')[0]
  const numbers = s.match(/\d+/g)
  const res: number[] = []
  if (numbers) {
    for (let i = 0; i < numbers.length; i += 2) {
      let v1 = parseInt(numbers[i])
      let v2 = parseInt(numbers[i + 1])
      if (v1 > v2) {
        const temp = v1
        v1 = v2
        v2 = temp
      }
      if (v1 && v2) {
        for (let j = 0; j < v1; j++) {
          res.push(v2)
        }
      } else {
        res.push(v1 || v2)
      }
    }
  }
  return res
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
