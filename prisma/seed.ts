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

const SALES_FILES = ['prisma/data/gaincitys.csv']

const prisma = new PrismaClient()

async function main() {
  await prisma.aircon.deleteMany()
  console.log('Deleted all aircon records')
  await prisma.sale.deleteMany()
  console.log('Deleted all sale records')
  await prisma.nea.deleteMany()
  console.log('Deleted all nea records')

  const neas: Nea[] = []
  const sales: Sale[] = []

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
          console.log('eeeeeee', errorRows)
          return null
        }
        const sale = {
          image: row['Image']?.replace(/^['"]+|['"]+$/g, '').trim(),
          url: row['Title_URL']?.replace(/^['"]+|['"]+$/g, '').trim(),
          model: row['Model']?.replace(/^['"]+|['"]+$/g, '').trim(),
          description: row['Description']?.replace(/^['"]+|['"]+$/g, '').trim(),
          price: Math.round(parseFloat(row['Price'].replace(/[^0-9.]/g, ''))),
        }
        return sale
      })
      .filter((sale) => sale != null) as Sale[]
    console.log(`Inserting ${records.length} sales`)
    await prisma.sale.createMany({ data: records, skipDuplicates: true })
    sales.push(...records)
  }

  const aircons = (await Promise.all(neas
    .map(async (nea) => {
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
      return {
        brand: nea.brand,
        model: nea.model,
        greenTicks: nea.greenTicks,
        annualConsumption: nea.annualConsumption,
        price: sale.price,
        image: sale.image,
        url: sale.url,
        description: sale.description,
      }
    })))
    .filter((item) => item != null)

  console.log(`Inserting ${aircons.length} aircons`)
  await prisma.aircon.createMany({ data: aircons })

  // // Fetch data from Nea and Sale tables
  // const dataToInsert = await prisma.nea.findMany({
  //   relationLoadStrategy: 'join',
  //   include: { Sale: true },
  //   where: {
  //     sale: {
  //       some: {
  //         model: {
  //           contains: prisma.nea.model
  //         },
  //       },
  //     },
  //   }
  // })

  // // Prepare the data for insertion
  // const preparedData = dataToInsert.flatMap((nea) => {
  //   return nea.Sale.map((sale) => ({
  //     brand: nea.brand,
  //     model: nea.model,
  //     greenTicks: nea.greenTicks,
  //     annualConsumption: nea.annualConsumption,
  //     price: sale.price,
  //     image: sale.image,
  //     url: sale.url,
  //     description: sale.description,
  //   }))
  // })

  // // Insert data into Aircon table
  // await prisma.aircon.createMany({
  //   data: preparedData,
  // })

  // await prisma.$executeRaw`
  //   INSERT INTO "Aircon" (
  //     "brand",
  //     "model",
  //     "greenTicks",
  //     "annualConsumption",
  //     "price",
  //     "image",
  //     "url",
  //     "description"
  //   )
  //   SELECT
  //     *
  //   FROM
  //     "Nea"
  //   INNER JOIN "Sale" ON Sale.model = Nea.model;
  // `
  // INNER JOIN "Sale" sale ON Sale.model LIKE CONCAT('%', Nea.model, '%')

  // const deletes = []
  // for (const sale of sales) {
  //   let matched = false
  //   for (const nea of neas) {
  //     if (sale.model.includes(nea.model)) {
  //       prisma.sale.update({
  //         where: { model: sale.model },
  //         data: { model: nea.model },
  //       })
  //       console.log(`Updated ${sale.model} to ${nea.model}`)
  //       matched = true
  //     }
  //   }
  //   if (!matched) {
  //     deletes.push(sale.model)
  //   }
  // }
  // console.log(`Deleted ${deletes.length} sales`)
  // prisma.sale.deleteMany({ where: { model: { in: deletes } } })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
