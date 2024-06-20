'use server'
import db from './prisma'
import {
  Aircon,
  AirconWithDetail,
  HouseType,
  ProfileFormValues,
  RoomType,
} from '../models/clientModels'

// TODO ALL

// values from
const HOUSEHOLD_AREAS = new Map<string, number>([
  [`${HouseType.one_room}${RoomType.bedroom}`, 1],
  [`${HouseType.one_room}${RoomType.kitchen}`, 1],
  [`${HouseType.two_room}${RoomType.entire_house}`, 2],
  [`${HouseType.two_room}${RoomType.living_room}`, 1],
  [`${HouseType.two_room}${RoomType.bedroom}`, 2],
  [`${HouseType.two_room}${RoomType.kitchen}`, 1],
  [`${HouseType.three_room}${RoomType.entire_house}`, 3],
  [`${HouseType.three_room}${RoomType.living_room}`, 1],
  [`${HouseType.three_room}${RoomType.bedroom}`, 3],
  [`${HouseType.three_room}${RoomType.kitchen}`, 1],
  [`${HouseType.four_room}${RoomType.entire_house}`, 4],
  [`${HouseType.four_room}${RoomType.living_room}`, 1],
  [`${HouseType.four_room}${RoomType.bedroom}`, 4],
  [`${HouseType.four_room}${RoomType.kitchen}`, 1],
  [`${HouseType.five_room}${RoomType.entire_house}`, 5],
  [`${HouseType.five_room}${RoomType.living_room}`, 1],
  [`${HouseType.five_room}${RoomType.bedroom}`, 5],
  [`${HouseType.five_room}${RoomType.kitchen}`, 1],
  [`${HouseType.jumbo}${RoomType.entire_house}`, 6],
  [`${HouseType.jumbo}${RoomType.living_room}`, 1],
  [`${HouseType.jumbo}${RoomType.bedroom}`, 5],
  [`${HouseType.jumbo}${RoomType.kitchen}`, 1],
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
    console.log(ht, rt)
    const btu = getBtuRequired(ht, rt)
    const res = await db.aircon.findMany({
      where: {
        greenTicks: {
          gte: 3,
        },
      },
      include: {
        airconDetail: true,
      },
    })
    res.filter(
      (aircon) =>
        aircon.airconDetail != null && aircon.airconDetail.btus.length === ac,
    )
    return res.map((aircon) => {
      const lifecycleCost = calcLifecycleCost(aircon.annualConsumption, uh)
      const lifespanEnergyCost = calcLifespanEnergyCost(aircon.price, lifecycleCost)
      const annualEnergyCost = calcAnnualEnergyCost()
      const annualEnergySavings = calcAnnualEnergySavings()
      const carbonEmmissionsReduced = calcCarbonEmmissionsReduced()
      return {
        ...aircon,
        lifecycleCost,
        lifespanEnergyCost,
        annualEnergyCost,
        annualEnergySavings,
        carbonEmmissionsReduced,
      }
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching entries from database.')
  }
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
    const lifecycleCost = calcLifecycleCost(res.annualConsumption, usageHours)
    const lifespanEnergyCost = calcLifespanEnergyCost(res.price, lifecycleCost)
    const annualEnergyCost = calcAnnualEnergyCost()
    const annualEnergySavings = calcAnnualEnergySavings()
    const carbonEmmissionsReduced = calcCarbonEmmissionsReduced()
    return {
      ...res,
      lifecycleCost,
      lifespanEnergyCost,
      annualEnergyCost,
      annualEnergySavings,
      carbonEmmissionsReduced,
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
      image:
        'https://www.gaincity.com/media/catalog/product/cache/be915254533b907fb2702448e2097390/m/x/mxy-4h33vg_sys_4_17.jpg',
      lifecycleCost: 1000,
      lifespanEnergyCost: 1000,
      annualEnergyCost: 1000,
      annualEnergySavings: 1000,
      carbonEmmissionsReduced: 1000,
    },
    {
      id: 2,
      name: 'Mitsubishi Starmex',
      brand: 'Mitsubishi',
      model: 'Starmex',
      greenTicks: 4,
      annualConsumption: 600,
      price: 600,
      image:
        'https://www.gaincity.com/media/catalog/product/cache/be915254533b907fb2702448e2097390/m/x/mxy-4h33vg_sys_4_17.jpg',
      lifecycleCost: 900,
      lifespanEnergyCost: 900,
      annualEnergyCost: 900,
      annualEnergySavings: 900,
      carbonEmmissionsReduced: 900,
    },
    {
      id: 3,
      name: 'Daikin Inverter',
      brand: 'Daikin',
      model: 'Inverter',
      greenTicks: 3,
      annualConsumption: 700,
      price: 700,
      image:
        'https://www.gaincity.com/media/catalog/product/cache/be915254533b907fb2702448e2097390/m/x/mxy-4h33vg_sys_4_17.jpg',
      lifecycleCost: 800,
      lifespanEnergyCost: 800,
      annualEnergyCost: 800,
      annualEnergySavings: 800,
      carbonEmmissionsReduced: 800,
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

// values from https://www.ema.gov.sg/consumer-information/electricity/buying-electricity/buying-at-regulated-tariff
// as of 20/6/2024
function calcLifecycleCost(annualConsumption: number, usageHours: number) {
  return annualConsumption * usageHours * 0.3247
}

// values from
// as of 20/6/2024
function calcLifespanEnergyCost(price: number, lifecycleCost: number) {
  return price + lifecycleCost * 7
}

function calcAnnualEnergyCost() {
  return 0
}

function calcAnnualEnergySavings() {
  return 0
}

function calcCarbonEmmissionsReduced() {
  return 0
}
