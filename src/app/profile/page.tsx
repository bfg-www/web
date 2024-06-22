'use client'

import { Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { ProfileFormValues } from '../models/clientModels'
import { getAirconsForProfile } from '../lib/aircon'
import { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import ProductCard from '../ui/profile/ProductCard'
import { Aircon } from '@/app/models/clientModels'
import EnergyProfileFormWidget from '../ui/profile/EnergyProfileFormWidget'
import FilterPanel, { Filter } from '../ui/profile/FilterPanel'
import SkeletonPlaceholder from '../ui/profile/SkeletonPlaceholder'
import ResultsNotFound from '../ui/profile/ResultsNotFound'
import SortByDropdown from '../ui/profile/SortByDropdown'
import {
  updateAirconResultsInLocalStorage,
  updateProfileFormValuesInLocalStorage,
} from '../ui/helpers'

// Page component should handle filter state + data fetching state
export default function Page() {
  const [isResultsFetching, setIsResultsFetching] = useState<boolean>(false)
  const [isFiltersApplying, setIsFiltersApplying] = useState<boolean>(false)
  const [isSortApplying, setIsSortApplying] = useState<boolean>(false)
  const [results, setResults] = useState<Aircon[]>([])
  const [sortOrder, setSortOrder] = useState<string>('')

  useEffect(() => {
    setResults(JSON.parse(localStorage.getItem('airconResults') || '[]'))
  }, [])

  const handleFormWidgetSubmit = async (data: ProfileFormValues) => {
    console.log('handleFormWidgetSubmit called')
    setIsResultsFetching(true)
    try {
      const newResults = await getAirconsForProfile(data)
      setResults(newResults)
      updateAirconResultsInLocalStorage(newResults)
      updateProfileFormValuesInLocalStorage(data)
      console.log('is the try catch completed?')
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
      if (typeof window !== 'undefined') {
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
      }
    }, 1500)
  }

  const handleSort = (sortBy: string) => {
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
