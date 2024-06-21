'use server'
import db from './prisma'
import {
  Aircon,
  AirconWithDetail,
  HouseType,
  ProfileFormValues,
  RoomType,
} from '../models/clientModels'

// values from https://doorvisual.com/hdb-flat-sizes-and-types-singapore/ , chatGPT 4o, https://www.teoalida.com/singapore/hdbflattypes/
// as of 20/6/2024
const HOUSEHOLD_AREAS = new Map<string, number>([
  [`${HouseType.one_room}${RoomType.entire_house}`, 35],
  [`${HouseType.one_room}${RoomType.living_room}`, 35],
  [`${HouseType.one_room}${RoomType.bedroom}`, 35],
  [`${HouseType.one_room}${RoomType.kitchen}`, 35],
  [`${HouseType.two_room}${RoomType.entire_house}`, 40],
  [`${HouseType.two_room}${RoomType.living_room}`, 14],
  [`${HouseType.two_room}${RoomType.bedroom}`, 11],
  [`${HouseType.two_room}${RoomType.kitchen}`, 7],
  [`${HouseType.three_room}${RoomType.entire_house}`, 63],
  [`${HouseType.three_room}${RoomType.living_room}`, 20],
  [`${HouseType.three_room}${RoomType.bedroom}`, 12],
  [`${HouseType.three_room}${RoomType.kitchen}`, 8],
  [`${HouseType.four_room}${RoomType.entire_house}`, 95],
  [`${HouseType.four_room}${RoomType.living_room}`, 24],
  [`${HouseType.four_room}${RoomType.bedroom}`, 13],
  [`${HouseType.four_room}${RoomType.kitchen}`, 9],
  [`${HouseType.five_room}${RoomType.entire_house}`, 115],
  [`${HouseType.five_room}${RoomType.living_room}`, 27],
  [`${HouseType.five_room}${RoomType.bedroom}`, 12],
  [`${HouseType.five_room}${RoomType.kitchen}`, 11],
  [`${HouseType.jumbo}${RoomType.entire_house}`, 150],
  [`${HouseType.jumbo}${RoomType.living_room}`, 33],
  [`${HouseType.jumbo}${RoomType.bedroom}`, 14],
  [`${HouseType.jumbo}${RoomType.kitchen}`, 11],
])

export async function getAirconsForProfile({
  householdType,
  airconCount,
  installationLocation,
  usageHours,
}: ProfileFormValues): Promise<Aircon[]> {
  try {
    const ht = HouseType[householdType as keyof typeof HouseType]
    const ac = Number(airconCount)
    const rt = RoomType[installationLocation as keyof typeof RoomType]
    const uh = Number(usageHours)
    const btu = getBtuRequired(ht, rt)
    const res = (
      await db.aircon.findMany({
        // TODO: should?
        where: {
          greenTicks: {
            gte: 3,
          },
        },
        include: {
          airconDetail: true,
        },
        orderBy: [
          {
            price: 'asc',
          },
          {
            greenTicks: 'desc',
          },
          {
            annualConsumption: 'asc',
          },
        ],
      })
    ).filter(
      (aircon) =>
        // number of btu == number of aircons wanted
        aircon.airconDetail != null && 
        aircon.airconDetail.btus.length === ac
        // TODO: add range of btus for recos
    )
    const averageConsumption = await getAverageConsumption(res[0].greenTicks)

    return res.map((aircon) => {
      return {
        ...aircon,
        ...getCalculations(
          aircon.annualConsumption,
          averageConsumption,
          uh,
          aircon.price,
        ),
      }
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching entries from database.')
  }
}

export async function getAverageConsumption(ticks: number): Promise<number> {
  let averageConsumption = await db.aircon.aggregate({
    _avg: {
      annualConsumption: true,
    },
    where: {
      greenTicks: {
        equals: ticks,
      },
      // TODO: add range of btus for recos
      // airconDetail: {
      //   btus: {
      //     has: 1,
      //   },
      // }
    },
  })
  if (
    !averageConsumption ||
    averageConsumption._avg.annualConsumption == null
  ) {
    averageConsumption = await db.aircon.aggregate({
      _avg: {
        annualConsumption: true,
      },
    })
  }
  return averageConsumption._avg.annualConsumption ?? 0
}

export async function getAirconDetail(
  id: number,
  usageHours: number,
): Promise<AirconWithDetail> {
  try {
    const res = await db.aircon.findFirstOrThrow({
      where: { id },
      include: { airconDetail: true },
    })
    const averageConsumption = await getAverageConsumption(res.greenTicks)
    return {
      ...res,
      ...getCalculations(
        res.annualConsumption,
        averageConsumption,
        usageHours,
        res.price,
      ),
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching entry from database.')
  }
}

// dev only
export async function getDummyAircons(): Promise<Aircon[]> {
  return [
    {
      id: 1,
      name: 'LG Inverter V',
      brand: 'LG',
      model: 'Inverter V',
      greenTicks: 5,
      annualConsumption: 500,
      price: 500,
      image: '/aircon/stock.png',
      brandLogo: '/brands/lg.svg',
      brandUrl: 'https://www.lg.com/sg/',
      lifecycleCost: 1000,
      lifespanEnergyCost: 1000,
      annualEnergyCost: 1000,
      annualEnergySavings: 1000,
      carbonEmissionsReduced: 1000,
    },
    {
      id: 2,
      name: 'Mitsubishi Starmex',
      brand: 'Mitsubishi',
      model: 'Starmex',
      greenTicks: 4,
      annualConsumption: 600,
      price: 600,
      image: '/aircon/stock.png',
      brandLogo: '/brands/mitsubishi.svg',
      brandUrl: 'https://sg.mitsubishielectric.com/',
      lifecycleCost: 900,
      lifespanEnergyCost: 900,
      annualEnergyCost: 900,
      annualEnergySavings: 900,
      carbonEmissionsReduced: 900,
    },
    {
      id: 3,
      name: 'Daikin Inverter',
      brand: 'Daikin',
      model: 'Inverter',
      greenTicks: 3,
      annualConsumption: 700,
      price: 700,
      image: '/aircon/stock.png',
      brandLogo: '/brands/daikin.png',
      brandUrl: 'https://www.daikin.com.sg/',
      lifecycleCost: 800,
      lifespanEnergyCost: 800,
      annualEnergyCost: 800,
      annualEnergySavings: 800,
      carbonEmissionsReduced: 800,
    },
  ]
}

// formula from https://www.nea.gov.sg/our-services/climate-change-energy-efficiency/energy-efficiency/household-sector/choosing-the-right-cooling-capacity-for-your-air-conditioner
// as of 20/6/2024
function getBtuRequired(
  householdType: HouseType,
  installationLocation: RoomType,
) {
  const area = HOUSEHOLD_AREAS.get(`${householdType}${installationLocation}`)
  if (!area) {
    throw new Error(
      'Invalid household type and installation location combination',
    )
  }
  const capacity = area / 5
  const btu = capacity * 3412
  return btu
}

function getCalculations(
  annualConsumption: number,
  averageConsumption: number,
  usageHours: number,
  price: number,
) {
  const annualEnergyCost = calcAnnualEnergyCost(annualConsumption, usageHours)
  const lifespanEnergyCost = calcLifespanEnergyCost(annualEnergyCost)
  const lifecycleCost = calcLifecycleCost(lifespanEnergyCost, price)
  const annualEnergySavings = calcAnnualEnergySavings(
    averageConsumption,
    annualConsumption,
    usageHours,
  )
  const carbonEmissionsReduced = calcCarbonEmissionsReduced(
    averageConsumption,
    annualConsumption
  )
  return {
    lifecycleCost,
    lifespanEnergyCost,
    annualEnergyCost,
    annualEnergySavings,
    carbonEmissionsReduced,
  }
}

// as of 20/6/2024
// values from google search
const AVERAGE_LIFESPAN = 7
// values from https://www.ema.gov.sg/consumer-information/electricity/buying-electricity/buying-at-regulated-tariff
const ELECTRICITY_TARIFF = 0.3247
// values from https://www.ema.gov.sg/resources/singapore-energy-statistics/chapter2#grid-emission-factor
const CO2_INTENSITY = 0.417

// cost of energy consumed annually
function calcAnnualEnergyCost(annualConsumption: number, usageHours: number) {
  return annualConsumption * usageHours * ELECTRICITY_TARIFF
}

// cost of energy consumed over the lifespan of the aircon
function calcLifespanEnergyCost(annualEnergyCost: number) {
  return annualEnergyCost * AVERAGE_LIFESPAN
}

// total cost of ownership
function calcLifecycleCost(lifespanEnergyCost: number, price: number) {
  return lifespanEnergyCost + price
}

// difference in cost in personal consumption and the average consumption
function calcAnnualEnergySavings(
  averageConsumption: number,
  annualConsumption: number,
  usageHours: number,
) {
  return (averageConsumption - annualConsumption) * usageHours * ELECTRICITY_TARIFF
}

// carbon emissions reduced per year
function calcCarbonEmissionsReduced(
  averageConsumption: number,
  annualConsumption: number,
) {
  return (averageConsumption - annualConsumption) * CO2_INTENSITY
}
