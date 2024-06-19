'use client'
import {
  Box,
  Button,
  FormControl,
  Grid,
  GridItem,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { FormValues } from '../ui/profiling/EnergyProfileForm'
import { useState } from 'react'
import {
  HOUSEHOLD_TYPE_OPTIONS,
  INSTALLATION_LOCATION_OPTIONS,
} from '../ui/models/profile-options'
import { IoIosRefresh } from 'react-icons/io'
import { FaRegHeart } from 'react-icons/fa'
import { GiCheckMark } from 'react-icons/gi'
import { TbChecks } from 'react-icons/tb'

// TODO: Mock user data to be stored in localStorage later
// user_energy_profile matches form values from profiling page
const USER_ENERGY_PROFILE = {
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
    greenTicks: 5,
    annualConsumption: 1000,
    price: 3000,
  },
  {
    id: '2',
    brand: 'Daikin',
    model: 'FTXJ25P',
    greenTicks: 4,
    annualConsumption: 1200,
    price: 2000,
  },
  {
    id: '3',
    brand: 'Panasonic',
    model: 'CS/CU-Z25VKR',
    greenTicks: 3,
    annualConsumption: 1500,
    price: 1000,
  },
]

const INITIAL_FILTERS = {
  greenTicks: 0,
  isClimateVoucherEligibleOnly: false,
  maxPrice: 0,
  brand: '',
}

interface Filter {
  greenTicks: number
  isClimateVoucherEligibleOnly: boolean
  maxPrice: number
  brand: string
}

interface Aircon {
  id: string
  brand: string
  model: string
  greenTicks: number
  annualConsumption: number
  price: number
}

export const ENERGY_RATING_OPTIONS = [
  { label: <>&#10004;</>, value: 1 },
  { label: <>&#10004; &#10004;</>, value: 2 },
  { label: <>&#10004; &#10004; &#10004;</>, value: 3 },
  { label: <>&#10004; &#10004; &#10004; &#10004;</>, value: 4 },
  { label: <>&#10004; &#10004; &#10004; &#10004; &#10004;</>, value: 5 },
]

// HELPER FUNCTIONS
export function getAirconBrands(USER_ENERGY_PROFILE: FormValues) {
  // Create a Set to store unique brands
  const brands = new Set()

  // Iterate over each record in the records array
  RESULTS.forEach((RESULTS) => {
    if (RESULTS.brand) {
      // Add the brand to the Set
      brands.add(RESULTS.brand)
    }
  })

  // Convert the Set to an array and return it
  return Array.from(brands)
}

// Page component should handle filter state + data fetching state
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

  // Both search and apply filter will update the listings, albeit due to different reasons
  const handleSearch = () => {}

  const handleApplyFilters = () => {}

  return (
    <Grid
      templateAreas={`"personal personal" "filter results"`}
      gridTemplateRows={'100px 1fr'}
      gridTemplateColumns={'1fr 3fr'}
      minHeight="100vh"
      minWidth="100vh"
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
              color=" #F0F1E7"
              colorScheme="blackAlpha"
              borderRadius="15px"
              rightIcon={<FaRegHeart />}
            >
              Favourites
            </Button>
          </Link>
        </HStack>
      </GridItem>
      <GridItem bg="white" borderRadius="15px" area={'filter'}>
        <FilterPanel />
      </GridItem>
      <GridItem bg="pink.300" area={'results'}>
        results
      </GridItem>
    </Grid>
  )
}

// TODOL: Will handle filter state separately from parent since it doesn't have to fetch new data, BE alr passes the whole thing lol!
function FilterPanel() {
  const [filters, setFilters] = useState<Filter>(INITIAL_FILTERS)

  const handleParamChange = (
    param: keyof Filter,
    value: string | number | boolean,
  ) => {
    setFilters({ ...filters, [param]: value })
  }

  const handleReset = () => {
    setFilters(INITIAL_FILTERS)
  }

  return (
    <VStack>
      <VStack backgroundColor="white" p={5}>
        <HStack>
          <TbChecks color="#4F772D" size="25px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Energy Tick Ratings
          </Text>
        </HStack>
        <FormControl display="inline-block">
          <Select
            w="250px"
            placeholder="Select ticks"
            value={filters.greenTicks}
            bg="#F0F1E7"
            color="#4F772D"
            borderRadius="20px"
            variant="flushed"
            sx={{ textAlign: 'center' }}
            onChange={(e) => handleParamChange('greenTicks', e.target.value)}
          >
            {ENERGY_RATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </VStack>
    </VStack>
  )
}

// ************* JX TODO: add getDummyAircon(data) to update button ************* //
function EnergyProfileFormWidget({
  onSubmit,
}: {
  onSubmit: (data: FormValues) => void
}) {
  // TODO: Get data from localStorage or context
  const [householdType, setHouseholdType] = useState<string>(
    USER_ENERGY_PROFILE.householdType,
  )
  const [airconCount, setAirconCount] = useState<string>(
    USER_ENERGY_PROFILE.airconCount,
  )
  const [installationLocation, setInstallationLocation] = useState<string>(
    USER_ENERGY_PROFILE.installationLocation,
  )
  const [usageHours, setUsageHours] = useState<string>(
    USER_ENERGY_PROFILE.usageHours,
  )

  return (
    <VStack backgroundColor="rgba(37, 54, 16)" borderRadius="20px" p={3}>
      <Text fontSize="xs" alignSelf="flex-start" color="#F0F1E7" as="kbd">
        Based on your energy profile:
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({
            householdType,
            airconCount,
            installationLocation,
            usageHours,
          })
        }}
        id="energy-profile-form-widget"
      >
        <HStack spacing={5}>
          <FormControl display="inline-block" w="auto">
            <Select
              value={householdType}
              color="#F0F1E7"
              borderColor="#F0F1E7"
              variant="flushed"
              size="xs"
              sx={{ fontSize: '15px', textAlign: 'center' }}
              onChange={(e) => setHouseholdType(e.target.value)}
            >
              {HOUSEHOLD_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl display="inline-block" w="auto">
            <HStack>
              <NumberInput
                min={1}
                max={10}
                value={airconCount}
                onChange={(valueString) => setAirconCount(valueString)}
                color="#F0F1E7"
                borderColor="#F0F1E7"
                variant="flushed"
                size="xs"
                maxW={14}
              >
                <NumberInputField sx={{ fontSize: '15px' }} />
              </NumberInput>
              <Text fontSize="15px" mt={1} alignItems="center" color="#F0F1E7">
                air-con(s)
              </Text>
            </HStack>
          </FormControl>
          <FormControl display="inline-block" w="auto">
            <Select
              value={installationLocation}
              color="#F0F1E7"
              borderColor="#F0F1E7"
              variant="flushed"
              size="xs"
              sx={{ fontSize: '15px', textAlign: 'center' }}
              onChange={(e) => setInstallationLocation(e.target.value)}
            >
              {INSTALLATION_LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl display="inline-block" w="auto">
            <HStack>
              <NumberInput
                min={1}
                max={24}
                value={usageHours}
                onChange={(valueString) => setUsageHours(valueString)}
                color="#F0F1E7"
                borderColor="#F0F1E7"
                variant="flushed"
                size="xs"
                maxW={14}
              >
                <NumberInputField
                  sx={{ fontSize: '15px', textAlign: 'center' }}
                />
              </NumberInput>
              <Text fontSize="15px" mt={1} alignItems="center" color="#F0F1E7">
                hour(s) a day
              </Text>
            </HStack>
          </FormControl>
          <Button
            type="submit"
            form="energy-profile-form-widget"
            size="xs"
            variant="solid"
            backgroundColor="#F0F1E7"
            color="#253610"
            colorScheme="whiteAlpha"
            borderRadius="10px"
            alignSelf="flex-end"
            iconSpacing={1}
            rightIcon={<IoIosRefresh />}
          >
            Update
          </Button>
        </HStack>
      </form>
    </VStack>
  )
}
