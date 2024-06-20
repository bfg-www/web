// Remaps Prisma models to models for use in client-side code for abstraction of ORM

import { Aircon as PrismaAircon, AirconDetail as PrismaAirconDetail } from '@prisma/client'

export type Aircon = PrismaAircon & {
  lifecycleCost: number,
  lifespanEnergyCost: number,
  annualEnergyCost: number,
  annualEnergySavings: number,
  carbonEmmissionsReduced: number,
}

export type AirconDetail = PrismaAirconDetail
export type AirconWithDetail = Aircon & { airconDetail?: AirconDetail | null }

export enum HouseType {
  one_room = '1-Room',
  two_room = '2-Room',
  three_room = '3-Room',
  four_room = '4-Room',
  five_room = '5-Room',
  jumbo = 'Jumbo/Executive'
}

export enum RoomType {
  entire_house = 'entire house',
  living_room = 'Living Room',
  bedroom = 'bedroom(s)',
  kitchen = 'kitchen',
}

export interface ProfileFormValues {
  householdType: string
  airconCount: string
  installationLocation: string
  usageHours: string
}