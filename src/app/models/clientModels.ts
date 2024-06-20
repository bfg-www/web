// Remaps Prisma models to models for use in client-side code for abstraction of ORM

import { Aircon as PrismaAircon, AirconDetail as PrismaAirconDetail } from '@prisma/client'

export type Aircon = PrismaAircon
export type AirconDetail = PrismaAirconDetail
export type AirconWithDetail = Aircon & { airconDetail?: AirconDetail | null }

export enum RoomType {
  HOUSE = 'House',
  LIVING_ROOM = 'Living Room',
  BEDROOM = 'Bedroom',
  KITCHEN = 'Kitchen',
}

export type Profile = {
  numberRooms: number
  numberAircons: number
  roomType: RoomType
  usageHours: number
}
