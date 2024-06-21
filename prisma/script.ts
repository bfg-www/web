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

const prisma = new PrismaClient()

async function main() {
  const aircons = await prisma.aircon.findMany()

  const newsales = await Promise.all(
    aircons.map(async (aircon) => {
      if (!aircon) {
        return
      }
      const brand = aircon.brand.toLowerCase()
      const image = aircon.image
      const brandLogo = BRAND_LOGO[brand as keyof typeof BRAND_LOGO]
      const brandUrl = BRAND_URL[brand as keyof typeof BRAND_URL]
      const sale = await prisma.sale.findFirst({
        where: {
          image: image,
        },
      })
      if (!sale) {
        return
      }
      const model = sale.model
      const description = sale.description
      const price = sale.price
      return {
        image: '/aircon/stock.png',
        url: brandUrl,
        brandLogo,
        brandUrl,
        model,
        description,
        price,
      }
    }),
  )
  console.log(newsales)
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
