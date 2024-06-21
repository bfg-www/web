import { Aircon, ProfileFormValues } from '@/app/models/clientModels'

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

export function updateProfileFormValuesInLocalStorage(
  newValues: Partial<ProfileFormValues>,
) {
  if (typeof window !== 'undefined') {
    // Retrieve current values from localStorage
    const currentValues = JSON.parse(
      localStorage.getItem('profileFormValues') || '{}',
    )

    // Merge current values with new values
    const updatedValues = { ...currentValues, ...newValues }

    // Save updated values back to localStorage
    localStorage.setItem('profileFormValues', JSON.stringify(updatedValues))
  }
}
