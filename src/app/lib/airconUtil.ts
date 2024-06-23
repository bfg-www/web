import { HouseType, RoomType, System } from '../models/clientModels'

// values from https://doorvisual.com/hdb-flat-sizes-and-types-singapore/ , chatGPT 4o, https://www.teoalida.com/singapore/hdbflattypes/
// as of 20/6/2024
const HOUSEHOLD_AREAS = new Map<string, number>([
  [`${HouseType.one_room}${RoomType.entire_house}`, 33],
  [`${HouseType.one_room}${RoomType.living_room}`, 33],
  [`${HouseType.one_room}${RoomType.bedroom}`, 33],
  [`${HouseType.one_room}${RoomType.kitchen}`, 33],
  [`${HouseType.two_room}${RoomType.entire_house}`, 36],
  [`${HouseType.two_room}${RoomType.living_room}`, 12],
  [`${HouseType.two_room}${RoomType.bedroom}`, 10],
  [`${HouseType.two_room}${RoomType.kitchen}`, 6],
  [`${HouseType.three_room}${RoomType.entire_house}`, 60],
  [`${HouseType.three_room}${RoomType.living_room}`, 18],
  [`${HouseType.three_room}${RoomType.bedroom}`, 10],
  [`${HouseType.three_room}${RoomType.kitchen}`, 7],
  [`${HouseType.four_room}${RoomType.entire_house}`, 90],
  [`${HouseType.four_room}${RoomType.living_room}`, 22],
  [`${HouseType.four_room}${RoomType.bedroom}`, 10],
  [`${HouseType.four_room}${RoomType.kitchen}`, 9],
  [`${HouseType.five_room}${RoomType.entire_house}`, 115],
  [`${HouseType.five_room}${RoomType.living_room}`, 24],
  [`${HouseType.five_room}${RoomType.bedroom}`, 10],
  [`${HouseType.five_room}${RoomType.kitchen}`, 10],
  [`${HouseType.jumbo}${RoomType.entire_house}`, 140],
  [`${HouseType.jumbo}${RoomType.living_room}`, 30],
  [`${HouseType.jumbo}${RoomType.bedroom}`, 12],
  [`${HouseType.jumbo}${RoomType.kitchen}`, 12],
])

const STANDARD_BTUS = [9000, 12000, 14000, 18000, 22000, 24000, 30000]

// formula from https://www.nea.gov.sg/our-services/climate-change-energy-efficiency/energy-efficiency/household-sector/choosing-the-right-cooling-capacity-for-your-air-conditioner
// as of 20/6/2024
export function getBtuRequired(
  householdType: HouseType,
  installationLocation: RoomType,
): number {
  const area = HOUSEHOLD_AREAS.get(`${householdType}${installationLocation}`)
  if (!area) {
    throw new Error(
      'Invalid household type and installation location combination',
    )
  }
  const capacity = area / 5
  const btu = capacity * 3412
  const standardBtu = STANDARD_BTUS.find((standardBtu) => standardBtu >= btu)
  if (!standardBtu) {
    return btu
  }
  return standardBtu
}

export function castBtusToSystem(count: number, roomType: RoomType): System[] {
  if (roomType == RoomType.entire_house) {
    return [
      {
        units: [
          {
            roomType: RoomType.living_room,
            amount: 1,
          },
          {
            roomType: RoomType.bedroom,
            amount: count - 1,
          },
        ],
      },
      {
        units: [
          {
            roomType: RoomType.kitchen,
            amount: count,
          },
        ],
      },
    ]
  } else {
    return [
      {
        units: [
          {
            roomType,
            amount: count,
          },
        ],
      },
    ]
  }
}

export function getCalculations(
  annualConsumption: number,
  averageConsumption: number,
  usageHours: number,
  price: number,
): {
  lifecycleCost: number
  lifespanEnergyCost: number
  annualEnergyCost: number
  annualEnergySavings: number
  carbonEmissionsReduced: number
} {
  const annualEnergyCost = round(calcAnnualEnergyCost(annualConsumption, usageHours))
  const lifespanEnergyCost = round(calcLifespanEnergyCost(annualEnergyCost))
  const lifecycleCost = round(calcLifecycleCost(lifespanEnergyCost, price))
  const annualEnergySavings = round(calcAnnualEnergySavings(
    averageConsumption,
    annualConsumption,
    usageHours,
  ))
  const carbonEmissionsReduced = round(calcCarbonEmissionsReduced(
    averageConsumption,
    annualConsumption,
    usageHours,
  ))
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
// const CO2_INTENSITY = 0.417

// cost of energy consumed annually
export function calcAnnualEnergyCost(
  annualConsumption: number,
  usageHours: number,
) {
  return annualConsumption * usageHours * ELECTRICITY_TARIFF
}

// cost of energy consumed over the lifespan of the aircon
export function calcLifespanEnergyCost(annualEnergyCost: number) {
  return annualEnergyCost * AVERAGE_LIFESPAN
}

// total cost of ownership
export function calcLifecycleCost(lifespanEnergyCost: number, price: number) {
  return lifespanEnergyCost + price
}

// difference in cost in personal consumption and the average consumption
export function calcAnnualEnergySavings(
  averageConsumption: number,
  annualConsumption: number,
  usageHours: number,
) {
  return (
    (averageConsumption - annualConsumption) * usageHours * ELECTRICITY_TARIFF
  )
}

// % carbon emissions reduced per year
export function calcCarbonEmissionsReduced(
  averageConsumption: number,
  annualConsumption: number,
  usageHours: number,
) {
  return (
    (((averageConsumption - annualConsumption) * usageHours) /
      averageConsumption) *
    100
  )
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
