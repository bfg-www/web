'use server'
import { Aircon } from '@prisma/client'
import db from './prisma'
import { AirconDetail, AirconWithDetail, Profile } from '../models/clientModels'

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
    const res = await db.aircon.findMany()
    return res
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching entries from database.')
  }
}

export async function getAirconDetail(id: number): Promise<AirconWithDetail> {
  try {
    const res = await db.aircon.findFirstOrThrow({
      where: { id },
      include: { airconDetail: true },
    })
    return res
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
      brand: 'LG',
      model: 'Inverter V',
      greenTicks: 5,
      annualConsumption: 500,
      price: 500,
      image: 'https://www.gaincity.com/media/catalog/product/cache/be915254533b907fb2702448e2097390/m/x/mxy-4h33vg_sys_4_17.jpg',
      url: 'https://www.gaincity.com/mitsubishi-system-4-aircon-mxy-4h38vg-4xmsxy-fp10vg-t0158745',
      description: 'This is a dummy aircon',
    },
    {
      id: 2,
      brand: 'Mitsubishi',
      model: 'Starmex',
      greenTicks: 4,
      annualConsumption: 600,
      price: 600,
      image: 'https://www.gaincity.com/media/catalog/product/cache/be915254533b907fb2702448e2097390/m/x/mxy-4h33vg_sys_4_17.jpg',
      url: 'https://www.gaincity.com/mitsubishi-system-4-aircon-mxy-4h38vg-4xmsxy-fp10vg-t0158745',
      description: 'This is another dummy aircon',
    },
    {
      id: 3,
      brand: 'Daikin',
      model: 'Inverter',
      greenTicks: 3,
      annualConsumption: 700,
      price: 700,
      image: 'https://www.gaincity.com/media/catalog/product/cache/be915254533b907fb2702448e2097390/m/x/mxy-4h33vg_sys_4_17.jpg',
      url: 'https://www.gaincity.com/mitsubishi-system-4-aircon-mxy-4h38vg-4xmsxy-fp10vg-t0158745',
      description: 'This is yet another dummy aircon',
    }
  ]
}
