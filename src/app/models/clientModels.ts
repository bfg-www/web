// Remaps Prisma models to models for use in client-side code for abstraction of ORM

import {
  Aircon as PrismaAircon,
  AirconDetail as PrismaAirconDetail,
} from '@prisma/client'

export type Aircon = PrismaAircon & {
  lifecycleCost: number
  lifespanEnergyCost: number
  annualEnergyCost: number
  annualEnergySavings: number
  carbonEmissionsReduced: number
}

export type AirconDetail = PrismaAirconDetail
export type AirconWithDetail = Aircon & { 
  airconDetail: {
    url: string,
    btus: number[]
    systems: System[]
  }
 }

export enum HouseType {
  one_room = '1-Room',
  two_room = '2-Room',
  three_room = '3-Room',
  four_room = '4-Room',
  five_room = '5-Room',
  jumbo = 'Jumbo/Executive',
}

export enum RoomType {
  entire_house = 'entire house',
  living_room = 'Living Room',
  bedroom = 'bedroom',
  kitchen = 'kitchen',
}

export interface ProfileFormValues {
  householdType: string
  airconCount: string
  installationLocation: string
  usageHours: string
}

export type System = {
  units: {
    roomType: RoomType
    amount: number
  }[]
}
