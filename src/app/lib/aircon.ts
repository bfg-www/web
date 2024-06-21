'use server'
import db from './prisma'
import {
  Aircon,
  AirconWithDetail,
  HouseType,
  ProfileFormValues,
  RoomType,
} from '../models/clientModels'
import { getBtuRequired, castBtusToSystem, getCalculations } from './airconUtil'

const BTU_UPPER_BOUND = 1.3

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
    const btuRequired = getBtuRequired(ht, rt)
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
    ).filter((aircon) => {
      if (aircon.airconDetail == null) {
        return false
      }
      const btusum = aircon.airconDetail.btus.reduce((acc, btu) => acc + btu, 0)
      if (aircon.airconDetail.btus.length === ac) {
        console.log(btusum, btuRequired, btuRequired * BTU_UPPER_BOUND)
        console.log("^")
      }
      console.log(btusum, btuRequired, btuRequired * BTU_UPPER_BOUND)
      // number of btu == number of aircons wanted
      return (
        aircon.airconDetail.btus.length === ac &&
        btusum >= btuRequired &&
        btusum <= btuRequired * BTU_UPPER_BOUND
      )
    })
    const averageConsumption = await getAverageConsumption(
      res[0].greenTicks,
      ht,
      rt,
    )

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

export async function getAverageConsumption(
  ticks: number,
  houseType: HouseType,
  roomType: RoomType,
): Promise<number> {
  const btuRequired = getBtuRequired(houseType, roomType)
  // filter by ticks
  const filterTicksAircons = await db.aircon.findMany({
    where: {
      greenTicks: {
        equals: ticks,
      },
    },
    include: {
      airconDetail: true,
    },
  })
  // then filter by btu range
  const filterBtuAircons = filterTicksAircons.filter((aircon) => {
    if (aircon.airconDetail == null) {
      return false
    }
    const btusum = aircon.airconDetail?.btus.reduce((acc, btu) => acc + btu, 0)
    return btusum >= btuRequired && btusum <= btuRequired * BTU_UPPER_BOUND
  })
  // then get average consumption
  let averageConsumption =
    filterBtuAircons.reduce((acc, aircon) => {
      return acc + aircon.annualConsumption
    }, 0) / filterBtuAircons.length
  // else get average consumption of all aircons
  if (!averageConsumption) {
    averageConsumption =
      (
        await db.aircon.aggregate({
          _avg: {
            annualConsumption: true,
          },
        })
      )._avg.annualConsumption ?? 0
  }
  return averageConsumption
}

export async function getAirconDetail(
  id: number,
  usageHours: number,
  houseType: HouseType,
  roomType: RoomType,
): Promise<AirconWithDetail> {
  try {
    const res = await db.aircon.findFirstOrThrow({
      where: { id },
      include: { airconDetail: true },
    })
    const averageConsumption = await getAverageConsumption(
      res.greenTicks,
      houseType,
      roomType,
    )
    const system = castBtusToSystem(res.airconDetail?.btus ?? [])
    const newAirconDetail = {
      url: res.airconDetail?.url ?? '',
      btus: res.airconDetail?.btus ?? [],
      system,
    }
    const aircon: Aircon = {
      ...res,
      ...getCalculations(
        res.annualConsumption,
        averageConsumption,
        usageHours,
        res.price,
      ),
    }
    return {
      ...aircon,
      airconDetail: newAirconDetail,
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
