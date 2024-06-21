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

const BTU_UPPER_BOUND = 1.35

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

      // //
      // if (aircon.airconDetail.btus.length === ac) {
      //   console.log(aircon.airconDetail.btus, btuRequired, btuRequired * BTU_UPPER_BOUND)
      //   console.log("^")
      // } else {
      //   console.log(aircon.airconDetail.btus, btuRequired, btuRequired * BTU_UPPER_BOUND)
      // }
      // //

      const airconCountMatches = aircon.airconDetail.btus.length === ac
      if (rt === RoomType.entire_house) {
        const btusum = aircon.airconDetail.btus.reduce(
          (acc, btu) => acc + btu,
          0,
        )
        return (
          airconCountMatches &&
          btusum >= btuRequired &&
          btusum <= btuRequired * BTU_UPPER_BOUND
        )
      } else {
        return (
          airconCountMatches &&
          aircon.airconDetail.btus.reduce(
            (acc, btu) =>
              acc && btu >= btuRequired && btu <= btuRequired * BTU_UPPER_BOUND,
            true,
          )
        )
      }
    })

    return Promise.all(
      res.map(async (aircon) => {
        const averageConsumption = await getAverageConsumptionAgainstAircon(
          aircon.annualConsumption,
          aircon.airconDetail?.btus ?? [],
        )
        return {
          ...aircon,
          ...getCalculations(
            aircon.annualConsumption,
            averageConsumption,
            uh,
            aircon.price,
          ),
        }
      }),
    )
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching entries from database.')
  }
}

export async function getAverageConsumptionAgainstAircon(
  airconConsumption: number,
  airconBtus: number[],
): Promise<number> {
  if (airconBtus.length === 0) {
    return 0
  }
  const aggregate = await db.aircon.aggregate({
    _avg: {
      annualConsumption: true,
    },
    where: {
      greenTicks: {
        equals: 3,
      },
      airconDetail: {
        btus: {
          equals: airconBtus,
        },
      },
    },
  })
  if (
    aggregate == null ||
    aggregate._avg == null ||
    aggregate._avg.annualConsumption == null
  ) {
    return airconConsumption
  }
  return aggregate._avg.annualConsumption
}

export async function getAirconDetail(
  id: number,
  usageHours: number,
  roomType: RoomType,
): Promise<AirconWithDetail> {
  try {
    const res = await db.aircon.findFirstOrThrow({
      where: { id },
      include: { airconDetail: true },
    })
    if (res.airconDetail == null) {
      throw new Error('Aircon detail not found.')
    }
    const averageConsumption = await getAverageConsumptionAgainstAircon(
      res.annualConsumption,
      res.airconDetail.btus,
    )
    const systems = castBtusToSystem(res.airconDetail.btus.length, roomType)
    const newAirconDetail = {
      url: res.airconDetail.url,
      btus: res.airconDetail.btus,
      systems,
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
