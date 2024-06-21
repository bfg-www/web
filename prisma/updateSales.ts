import { Nea, PrismaClient, Sale } from '@prisma/client'
import * as fs from 'fs'
import Papa from 'papaparse'

const BRAND_LOGO = {
  daikin: '/brands/daikin.png',
  fujitsu: '/brands/fujitsu.png',
  haier: '/brands/haier.svg',
  hitachi: '/brands/hitachi.svg',
  lg: '/brands/lg.svg',
  midea: '/brands/midea.svg',
  'mitsubishi heavy industries': '/brands/mitsubishi-heavy.svg',
  'mitsubishi electric': '/brands/mitsubishi.svg',
}

const BRAND_URL = {
  daikin: 'https://www.daikin.com.sg/',
  fujitsu: 'https://www.fujitsu-general.com/sg/',
  haier: 'https://www.haier.com/',
  hitachi: 'https://www.hitachi.asia/',
  lg: 'https://www.lg.com/sg/',
  midea: 'https://www.midea.com/sg/',
  'mitsubishi heavy industries': 'https://www.mhi.com/',
  'mitsubishi electric': 'https://sg.mitsubishielectric.com/',
}

const SALES_FILES = ['prisma/data/.csv']

const prisma = new PrismaClient()

async function main() {
  const neas: Nea[] = await prisma.nea.findMany()
  const sales: {
    image: string
    url: string
    model: string
    description: string
    price: number
  }[] = []

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
    const records = results.data.reduce((res, row, index) => {
      if (errorRows.includes(index)) {
        return res
      }
      const description = row['Description']?.replace(/^['"]+|['"]+$/g, '').trim()
      if (description == null || !description.includes('BTU')) {
        return res
      }
      const sale = {
        image: row['Image']?.replace(/^['"]+|['"]+$/g, '').trim(),
        url: row['Title_URL']?.replace(/^['"]+|['"]+$/g, '').trim(),
        model: row['Model']?.replace(/^['"]+|['"]+$/g, '').trim(),
        description: row['Description']?.replace(/^['"]+|['"]+$/g, '').trim(),
        price: Math.round(
          parseFloat(row['Price'].replace(/[^0-9.]/g, '')),
        ),
      }
      res.push(sale)
      return res
    }, [])
    sales.push(...records)
  }

  // join nea with sale
  const newsales = neas.reduce(
    (
      res: {
        image: string
        url: string
        brandLogo: string
        brandUrl: string
        model: string
        description: string
        price: number
      }[],
      nea,
    ) => {
      const sale = sales.filter((sale) => sale.model.includes(nea.model))
      if (sale == null || sale.length === 0) {
        return res
      }
      const brand = nea.brand.toLowerCase()
      const brandLogo = BRAND_LOGO[brand as keyof typeof BRAND_LOGO]
      const brandUrl = BRAND_URL[brand as keyof typeof BRAND_URL]
      for (const s of sale) {
        res.push({
          image: '/aircon/stock.png',
          url: brandUrl,
          brandLogo,
          brandUrl,
          model: s.model,
          description: s.description,
          price: s.price,
        })
      }
      return res
    },
    [],
  )

  fs.writeFileSync(
    'prisma/data/sales.csv',
    Papa.unparse(newsales.filter((item) => item != null)),
  )
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
