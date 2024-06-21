export interface Aircon {
  id: string
  name: string
  brand: string
  model: string
  greenTicks: number
  annualConsumption: number
  price: number
  image: string
  brandLogo: string
  lifecycleCost: number
  lifespanEnergyCost: number
  annualEnergyCost: number
  annualEnergySavingsAmt: number
  carbonEmissionsReduced: number
}

export interface AirconWithDetail {
  id: number
  name: string
  brand: string
  model: string
  greenTicks: number
  annualConsumption: number
  price: number
  image: string
  brandLogo: string
  lifecycleCost: number
  lifespanEnergyCost: number
  annualEnergyCost: number
  annualEnergySavingsAmt: number
  carbonEmissionsReduced: number
  airconDetail: {
    id: number;
    airconId: number | null;
    url: string;
    btus: number[];
}
}