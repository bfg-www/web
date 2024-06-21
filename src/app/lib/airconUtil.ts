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

// formula from https://www.nea.gov.sg/our-services/climate-change-energy-efficiency/energy-efficiency/household-sector/choosing-the-right-cooling-capacity-for-your-air-conditioner
// as of 20/6/2024
export function getBtuRequired(
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

export function castBtusToSystem(btus: number[]) {
    const rawUnits = new Map<number, number>()
    // count the number of each btu
    for (const btu of btus) {
        if (rawUnits.has(btu)) {
            rawUnits.set(btu, rawUnits.get(btu)?? 0 + 1)
        } else {
            rawUnits.set(btu, 1)
        }
    }
    //sort by btu
    const sortedUnits = Array.from(rawUnits.entries()).sort((a, b) => a[0] - b[0])
    const system: System = {units: []}
    for (const rawUnit of sortedUnits) {
        const unit = {
            roomType: Object.entries(RoomType)[rawUnit[0]][1],
            amount: rawUnit[1]
        }
        system.units.push(unit)
    }
    return system
}

export function getCalculations(
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
    annualConsumption,
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

// carbon emissions reduced per year
export function calcCarbonEmissionsReduced(
  averageConsumption: number,
  annualConsumption: number,
) {
  return (averageConsumption - annualConsumption) * CO2_INTENSITY
}
