'use client'
import { Button, Grid, GridItem, HStack, Select, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { ProfileFormValues } from '../models/clientModels'
import { getAirconsForProfile, getDummyAircons } from '../lib/aircon'
import { useState } from 'react'
import { FaRegHeart } from 'react-icons/fa'
import ProductCard from '../ui/profile/ProductCard'
import { Aircon } from '@/app/models/clientModels'
import EnergyProfileFormWidget from '../ui/profile/EnergyProfileFormWidget'
import FilterPanel, { Filter } from '../ui/profile/FilterPanel'
import SkeletonPlaceholder from '../ui/profile/SkeletonPlaceholder'
import ResultsNotFound from '../ui/profile/ResultsNotFound'

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
  const [results, setResults] = useState<Aircon[]>([])
  const [sortOrder, setSortOrder] = useState<string>('')

  const handleFormWidgetSubmit = async (data: ProfileFormValues) => {
    console.log('handleFormWidgetSubmit called')
    console.log('data:', data)
    setIsResultsFetching(true)
    try {
      // const newResults = await getAirconsForProfile(data)
      const newResults = await getDummyAircons()
      console.log('newResults from BE:', newResults)
      setResults(newResults)
    } catch (error) {
      console.error(error)
    } finally {
      // else the loading speed is near-instant and the UX is jarring
      setTimeout(() => setIsResultsFetching(false), 1500)
    }
  }

  const handleApplyFilters = (filters: Filter) => {
    console.log('handleApplyFilters called')
    console.log('filters:', filters)
    setIsFiltersApplying(true)
    // simulate filtering UX
    setTimeout(() => {
      const filteredResults = results.filter((result) => {
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
      console.log('filteredResults:', filteredResults)
      setResults(filteredResults)
      setIsFiltersApplying(false)
    }, 1500)
  }

  const handleSort = (sortBy: string) => {
    console.log('handleSort called')
    setSortOrder(sortBy)
    setIsSortApplying(true)
    // Sort results based on sortBy
    const sortedResults = [...results].sort((a, b) => {
      if (sortBy === 'price') {
        return b.price - a.price
      } else if (sortBy === 'lifecycleCost') {
        return b.lifecycleCost - a.lifecycleCost
      } else if (sortBy === 'greenTicks') {
        return b.greenTicks - a.greenTicks
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
              rightIcon={<FaRegHeart />}
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
            <Select
              w="230px"
              placeholder="Sort by"
              value={sortOrder}
              bg="#F0F1E7"
              color="#4F772D"
              borderRadius="20px"
              focusBorderColor="#4F772D"
              variant="flushed"
              boxShadow="base"
              sx={{ textAlign: 'center' }}
              onChange={(e) => {
                handleSort(e.target.value)
              }}
            >
              {SORTING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </HStack>
        {isResultsFetching ||
          isFiltersApplying ||
          (isSortApplying && <SkeletonPlaceholder />)}
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
