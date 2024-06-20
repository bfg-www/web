import { Aircon } from './models/aircon-options'

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function getAirconBrands(results: Aircon[]): string[] {
  // Create a Set to store unique brands
  const brands = new Set<string>()

  // Iterate over each record in the records array
  results.forEach((results) => {
    if (results.brand) {
      // Add the brand to the Set
      brands.add(results.brand)
    }
  })

  // Convert the Set to an array and return it
  return Array.from(brands)
}
