import {
  Aircon,
  AirconWithDetail,
  ProfileFormValues,
} from '@/app/models/clientModels'

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
  newProfile: ProfileFormValues,
) {
  console.log('updateProfileFormValuesInLocalStorage is called')
  console.log('newProfile:', newProfile)
  if (typeof window !== 'undefined') {
    // Save updated results back to localStorage
    localStorage.setItem('userEnergyProfile', JSON.stringify(newProfile))
  }
}

export function updateAirconResultsInLocalStorage(newResults: Aircon[]) {
  if (typeof window !== 'undefined') {
    // Save updated results back to localStorage
    localStorage.setItem('airconResults', JSON.stringify(newResults))
  }
}

// Function to update favorites in localStorage
export function updateFavouritesInLocalStorage(item: AirconWithDetail) {
  if (typeof window !== 'undefined') {
    // Retrieve current favorites from localStorage
    const currentFavorites: AirconWithDetail[] = JSON.parse(
      localStorage.getItem('favourites') || '[]',
    )

    // Check if the item already exists in favorites
    const index = currentFavorites.findIndex((fav) => fav.id === item.id)

    if (index === -1) {
      // Item not found, add it to favorites
      const updatedFavorites = [...currentFavorites, item]
      localStorage.setItem('favourites', JSON.stringify(updatedFavorites))
    } else {
      // Item found, remove it from favorites
      const updatedFavorites = currentFavorites.filter(
        (fav) => fav.id !== item.id,
      )
      localStorage.setItem('favourites', JSON.stringify(updatedFavorites))
    }
  }
}
