'use client'
import { Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { FormValues } from '../ui/profiling/EnergyProfileForm'
import { useState } from 'react'
import { FaRegHeart } from 'react-icons/fa'
import ProductCard from '../ui/profile/ProductCard'
import { Aircon } from '../ui/models/aircon-options'
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

const RESULTS: Aircon[] = [
  {
    id: '1',
    brand: 'Mitsubishi',
    model: 'MSY-GE10VA',
    name: 'starmex system 4 aircon',
    greenTicks: 5,
    annualConsumption: 1000,
    price: 3000,
    btu: 9000,
    lifecycleCost: 5000,
    lifespanEnergyCost: 2000,
    annualEnergyCost: 324.1,
    annualEnergySavingsAmt: 0,
    carbonEmissionsReduced: 0.5,
  },
  {
    id: '2',
    brand: 'Daikin',
    model: 'FTXJ25P',
    name: 'inverter system 4 aircon ismile',
    greenTicks: 4,
    annualConsumption: 1200,
    price: 2000,
    btu: 9500,
    lifecycleCost: 6000,
    lifespanEnergyCost: 2200,
    annualEnergyCost: 350.2,
    annualEnergySavingsAmt: 0,
    carbonEmissionsReduced: 0.2,
  },
  {
    id: '3',
    brand: 'Panasonic',
    model: 'CS/CU-Z25VKR',
    name: 'inverter system 4 aircon coolbreeze',
    greenTicks: 3,
    annualConsumption: 1500,
    price: 1000,
    btu: 8000,
    lifecycleCost: 7000,
    lifespanEnergyCost: 2600,
    annualEnergyCost: 400.1,
    annualEnergySavingsAmt: 0,
    carbonEmissionsReduced: 0.1,
  },
]

// Page component should handle filter state + data fetching state
/* JX TODO: fetch data icon + picture for listings, render it together with results component render */
export default function Page() {
  const [isResultsFetching, setIsResultsFetching] = useState<boolean>(false)
  const [isFiltersApplying, setIsFiltersApplying] = useState<boolean>(false)
  const [results, setResults] = useState<Aircon[]>(RESULTS)

  const handleFormWidgetSubmit = (data: FormValues) => {
    console.log('handleFormWidgetSubmit called')
    console.log('data:', data)
    /* JX TODO: call getDummyAircon(data)
       - Await then get form data -> UI transition to data fetching state
       - Possible for BE to return data fetching state?
       - If not possible, FE to manually handle it: e..g  setIsResultsFetching(false -> true)
       */
    /* BY TODO: handle data fetching state
        -> skeleton loading, for profile widget & product listings, pass in isLoading prop
        -> data returned 
        -> listings renders
        ->  update local storage, get from local storage to populate profile widget */
  }

  // Both search (profile update) and apply filter (filter apply) will update the listings, albeit due to different reasons
  // * JX TODO: add getDummyAircon(data), wire up update button from EnergyProfileFormWidget //
  const handleSearch = () => {}

  const handleApplyFilters = (filters: Filter) => {
    console.log('handleApplyFilters called')
    console.log('filters:', filters)
    setIsResultsFetching(true)
    // simulate filtering UX
    setTimeout(() => {
      const filteredResults = RESULTS.filter((result) => {
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
      setIsResultsFetching(false)
    }, 3000)
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
          <EnergyProfileFormWidget onSubmit={handleFormWidgetSubmit} />
          <Link href="/favourites">
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
        <FilterPanel results={results} onSubmit={handleApplyFilters} />
      </GridItem>
      <GridItem borderRadius="10px" area={'results'}>
        {!isResultsFetching && <Text mb={1}>{results.length} results</Text>}
        {isResultsFetching && <SkeletonPlaceholder />}
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
