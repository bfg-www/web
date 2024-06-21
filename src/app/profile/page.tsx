'use client'
import { Button, Grid, GridItem, HStack, Select, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { ProfileFormValues } from '../models/clientModels'
import { getAirconsForProfile, getDummyAircons } from '../lib/aircon'
import { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import ProductCard from '../ui/profile/ProductCard'
import { Aircon } from '@/app/models/clientModels'
import EnergyProfileFormWidget from '../ui/profile/EnergyProfileFormWidget'
import FilterPanel, { Filter } from '../ui/profile/FilterPanel'
import SkeletonPlaceholder from '../ui/profile/SkeletonPlaceholder'
import ResultsNotFound from '../ui/profile/ResultsNotFound'
import SortByDropdown from '../ui/profile/SortByDropdown'
import { updateAirconResultsInLocalStorage } from '../ui/helpers'

// TODO: Mock user data to be stored in localStorage later
// user_energy_profile matches form values from profiling page
export const USER_ENERGY_PROFILE = {
  householdType: 'four_room',
  airconCount: '2',
  installationLocation: 'bedroom',
  usageHours: '8',
}

export const SORTING_OPTIONS = [
  { label: 'Price', value: 'price' },
  { label: 'Lifecycle cost', value: 'lifecycleCost' },
  { label: 'Energy tick ratings', value: 'greenTicks' },
]

// Page component should handle filter state + data fetching state
export default function Page() {
  const [isResultsFetching, setIsResultsFetching] = useState<boolean>(false)
  const [isFiltersApplying, setIsFiltersApplying] = useState<boolean>(false)
  const [isSortApplying, setIsSortApplying] = useState<boolean>(false)
  const [results, setResults] = useState<Aircon[]>(
    JSON.parse(localStorage.getItem('airconResults') || '[]'),
  )
  const [sortOrder, setSortOrder] = useState<string>('')
  const fullResults = JSON.parse(localStorage.getItem('airconResults') || '[]')

  const handleFormWidgetSubmit = async (data: ProfileFormValues) => {
    setIsResultsFetching(true)
    try {
      // const newResults = await getAirconsForProfile(data)
      const newResults = await getDummyAircons()
      setResults(newResults)
      updateAirconResultsInLocalStorage(newResults)
    } catch (error) {
      console.error(error)
    } finally {
      // else the loading speed is near-instant and the UX is jarring
      setTimeout(() => setIsResultsFetching(false), 1500)
    }
  }

  const handleApplyFilters = (filters: Filter) => {
    setIsFiltersApplying(true)
    // simulate filtering UX
    setTimeout(() => {
      const fullResults = JSON.parse(
        localStorage.getItem('airconResults') || '[]',
      )
      const filteredResults = fullResults.filter((result: Aircon) => {
        const matchesGreenTicks =
          filters.greenTicks === 0 || result.greenTicks === filters.greenTicks
        const matchesMaxPrice =
          Number(filters.maxPrice) === 0 ||
          result.price <= Number(filters.maxPrice)
        const matchesBrand =
          filters.brand === '' ||
          result.brand.toLowerCase() === filters.brand.toLowerCase()
        const matchesClimateVoucherEligibility =
          !filters.isClimateVoucherEligibleOnly || result.greenTicks === 5
        return (
          matchesGreenTicks &&
          matchesMaxPrice &&
          matchesBrand &&
          matchesClimateVoucherEligibility
        )
      })
      setResults(filteredResults)
      setIsFiltersApplying(false)
    }, 1500)
  }

  const handleSort = (sortBy: string) => {
    setSortOrder(sortBy)
    setIsSortApplying(true)
    // Sort results based on sortBy
    const sortedResults = [...results].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price
      } else if (sortBy === 'lifecycleCost') {
        return a.lifecycleCost - b.lifecycleCost
      } else if (sortBy === 'greenTicks') {
        return a.greenTicks - b.greenTicks
      }
      return 0
    })
    setTimeout(() => setIsSortApplying(false), 1000)
    setResults(sortedResults)
  }

  return (
    <Grid
      templateAreas={`"personal personal" "filter results"`}
      gridTemplateRows={'100px 1fr'}
      gridTemplateColumns={'1fr 4fr'}
      minHeight="100vh"
      minWidth="100vh"
      columnGap={5}
    >
      <GridItem area={'personal'}>
        <HStack justifyContent="space-between">
          <EnergyProfileFormWidget
            onSubmit={handleFormWidgetSubmit}
            isFetching={isResultsFetching}
            isEditable={true}
          />
          <Link href="profile/favourites">
            <Button
              type="submit"
              size="md"
              variant="solid"
              backgroundColor="#253610"
              color="#F0F1E7"
              colorScheme="blackAlpha"
              borderRadius="15px"
              rightIcon={<FaHeart />}
              boxShadow="base"
            >
              Favourites
            </Button>
          </Link>
        </HStack>
      </GridItem>
      <GridItem bg="white" borderRadius="10px" area={'filter'}>
        <FilterPanel
          results={results}
          onSubmit={handleApplyFilters}
          isUpdating={isFiltersApplying}
        />
      </GridItem>
      <GridItem borderRadius="10px" area={'results'}>
        <HStack width="100%" justifyContent="space-between" mb={3}>
          {!isResultsFetching && <Text mb={1}>{results.length} results</Text>}
          {!isResultsFetching && (
            <SortByDropdown sortBy={sortOrder} onChange={handleSort} />
          )}
        </HStack>
        {(isResultsFetching || isFiltersApplying || isSortApplying) && (
          <SkeletonPlaceholder />
        )}
        {!isResultsFetching && results.length === 0 && <ResultsNotFound />}
        {!isResultsFetching &&
          results.length !== 0 &&
          results.map((result, index) => (
            <ProductCard
              key={index}
              product={result}
              showTopChoiceTag={index === 0}
            />
          ))}
      </GridItem>
    </Grid>
  )
}
