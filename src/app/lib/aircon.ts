import { Aircon as PrismaAircon } from '@prisma/client'
import db from './prisma'
import { Profile } from '../models/clientModels'

export type Aircon = PrismaAircon

export async function getAllAircons(): Promise<Aircon[]> {
  try {
    return await db.aircon.findMany()
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching entries from database.')
  }
}

export async function getAirconsForProfile({
  numberRooms,
  numberAircons,
  roomType,
  usageHours,
}: Profile): Promise<Aircon[]> {
  try {
    return await db.aircon.findMany()
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching entries from database.')
  }
}

// dev only
export async function getDummyAircons(): Promise<Aircon[]> {
  return [
    {
      id: '1',
      brand: 'Mitsubishi',
      model: 'MSY-GE10VA',
      greenTicks: 5,
      annualConsumption: 1000,
    },
    {
      id: '2',
      brand: 'Daikin',
      model: 'FTXJ25P',
      greenTicks: 4,
      annualConsumption: 1200,
    },
    {
      id: '3',
      brand: 'Panasonic',
      model: 'CS/CU-Z25VKR',
      greenTicks: 3,
      annualConsumption: 1500,
    },
  ]
}
