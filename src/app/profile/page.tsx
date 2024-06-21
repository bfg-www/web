'use client'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Grid,
  GridItem,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { ProfileFormValues } from '../models/clientModels'
import { FaRegHeart } from 'react-icons/fa'
import { getAirconsForProfile, getDummyAircons } from '../lib/aircon'
import Image from 'next/image'
import { useState } from 'react'
import { Aircon } from '../models/clientModels'
import { IoIosRefresh } from 'react-icons/io'
import { LuDollarSign } from 'react-icons/lu'
import { PiMoneyWavyFill } from 'react-icons/pi'
import { TbChecks, TbAirConditioning } from 'react-icons/tb'
import {
  HOUSEHOLD_TYPE_OPTIONS,
  INSTALLATION_LOCATION_OPTIONS,
} from '../ui/models/profile-options'

// TODO: Mock user data to be stored in localStorage later
// user_energy_profile matches form values from profiling page
const USER_ENERGY_PROFILE = {
  householdType: 'four_room',
  airconCount: '2',
  installationLocation: 'bedroom',
  usageHours: '8',
}
const INITIAL_FILTERS = {
  greenTicks: 0,
  isClimateVoucherEligibleOnly: false,
  maxPrice: '',
  brand: '',
}

interface Filter {
  greenTicks: number
  isClimateVoucherEligibleOnly: boolean
  maxPrice: string
  brand: string
}

export const ENERGY_RATING_OPTIONS = [
  { label: <>&#10004;</>, value: 1 },
  { label: <>&#10004; &#10004;</>, value: 2 },
  { label: <>&#10004; &#10004; &#10004;</>, value: 3 },
  { label: <>&#10004; &#10004; &#10004; &#10004;</>, value: 4 },
  { label: <>&#10004; &#10004; &#10004; &#10004; &#10004;</>, value: 5 },
]

// HELPER FUNCTIONS
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

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function generateTickIcons(count: number) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <GiCheckMark size="25px" key={index} color="#4F772D" />
      ))}
    </>
  )
}

// Page component should handle filter state + data fetching state
/* JX TODO: fetch data icon + picture for listings, render it together with results component render */
export default function Page() {
  const [isResultsFetching, setIsResultsFetching] = useState<boolean>(false)
  const [isFiltersApplying, setIsFiltersApplying] = useState<boolean>(false)
  const [results, setResults] = useState<Aircon[]>([])

  const handleFormWidgetSubmit = async (data: ProfileFormValues) => {
    console.log('handleFormWidgetSubmit called')
    console.log('data:', data)
    setIsFiltersApplying(true)
    try {
      const newResults = await getAirconsForProfile(data)
      // const newResults = await getDummyAircons()
      console.log(newResults)
      setResults(newResults)
    } catch (error) {
      console.error(error)
    } finally {
      setIsFiltersApplying(false)
    }
    /* BY TODO: handle data fetching state
        -> skeleton loading, for profile widget & product listings, pass in isLoading prop
        -> data returned 
        -> listings renders
        ->  update local storage, get from local storage to populate profile widget */
  }

  // Both search (profile update) and apply filter (filter apply) will update the listings, albeit due to different reasons
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
    </Grid>
  )
}

function ProductCard({
  product,
  showTopChoiceTag,
}: {
  product: Aircon
  showTopChoiceTag: boolean
}) {
  const isClimateVoucherEligible = product.greenTicks === 5

  return (
    <VStack
      backgroundColor="white"
      height="320px"
      borderRadius="15px"
      p={3}
      boxShadow="base"
      mb={5}
    >
      <Flex width="100%" justifyContent="space-between">
        <HStack
          backgroundColor="green.500"
          spacing={0}
          borderRadius="15px"
          px={2}
          py={1}
        >
          <FaEarthAsia color="#F0F1E7" size="20px" />
          <Text fontSize="xs" color="#F0F1E7" as="kbd" ml={2} mr={1}>
            Reduce your carbon emissions by up to{' '}
            <strong>{product.carbonEmissionsReduced * 100}%</strong> with this
            option compared to less efficient models
          </Text>
          <CustomTooltip content="To be added"></CustomTooltip>
        </HStack>
        {showTopChoiceTag && (
          <Text
            background="green.300"
            fontSize="xs"
            color="#F0F1E7"
            borderRadius="15px"
            as="b"
            p={1}
          >
            Top choice!
          </Text>
        )}
      </Flex>
      <HStack borderWidth="1px" justifyContent="flex-start" width="100%">
        <Box borderWidth="1px" width="40%">
          INSERT AIRCON IMAGE
        </Box>
        <VStack borderWidth="1px" width="100%">
          <HStack borderWidth="1px" alignSelf="flex-start">
            <Box>INSERT BRAND LOGO</Box>
            <Text fontSize="lg">{capitalizeFirstLetter(product.brand)}</Text>
          </HStack>
          <Text as="b" fontSize="lg" alignSelf="flex-start">
            {product.name.toUpperCase()}
          </Text>
          <Text fontSize="sm" alignSelf="flex-start" color="grey">
            {product.model.toUpperCase()}
          </Text>
          <HStack alignSelf="flex-start" spacing="150px" borderWidth="1px">
            <VStack>
              <Text as="b" fontSize="lg">
                Price
              </Text>
              <Text fontSize="lg">${product.price}</Text>
            </VStack>
            <VStack>
              <Flex>
                <Text as="b" fontSize="lg">
                  Lifecycle cost
                </Text>
                <CustomTooltip content="To be added" color="#253610" />
              </Flex>
              <Text fontSize="lg">${product.lifecycleCost}</Text>
            </VStack>
            <VStack>
              <Flex>
                <Text as="b" fontSize="lg">
                  Annual energy cost
                </Text>
                <CustomTooltip content="To be added" color="#253610" />
              </Flex>
              <Text fontSize="lg">${product.annualEnergyCost}</Text>
            </VStack>
          </HStack>
          <HStack alignSelf="flex-start" borderWidth="1px" spacing={5}>
            <HStack spacing={0}>
              {generateTickIcons(Number(product.greenTicks))}
            </HStack>
            {isClimateVoucherEligible && (
              <Box width="100px" borderRadius="15px" boxShadow="base">
                <Image
                  src={climateVoucherLogo}
                  alt="Logo of government-issued climate vouchers"
                  width={100}
                />
              </Box>
            )}
          </HStack>
        </VStack>
      </HStack>
      <Button
        alignSelf="flex-end"
        ml="auto"
        backgroundColor="#F0F1E7"
        color="#253610"
        borderRadius="16px"
        p={3}
        boxShadow="base"
      >
        Find out more
      </Button>
    </VStack>
  )
}

function CustomTooltip({
  content,
  color = '#F0F1E7',
}: {
  content: string
  color?: string
}) {
  return (
    <Tooltip hasArrow label={content} placement="bottom" color="#F0F1E7">
      <span>
        <LiaQuestionCircle color={color} />
      </span>
    </Tooltip>
  )
}

function SkeletonPlaceholder() {
  console.log('SkeletonPlaceholder called')
  return (
    <Stack height="100%" width="100%" spacing={5}>
      <Skeleton
        startColor="#F0F1E7"
        endColor="white"
        height="250px"
        borderRadius="15px"
      />
      <Skeleton startColor="#F0F1E7" endColor="white" height="250px" />
      <Skeleton startColor="#F0F1E7" endColor="white" height="250px" />
      <Skeleton startColor="#F0F1E7" endColor="white" height="250px" />
      <Skeleton startColor="#F0F1E7" endColor="white" height="250px" />
    </Stack>
  )
}

function NotFound() {
  return (
    <VStack
      height="100%"
      width="100%"
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      <TbFaceIdError color="#4F772D" size="70px" />
      <Text fontSize="md" color="#4F772D" as="kbd">
        No results found
      </Text>
      <Text
        fontSize="md"
        color="#253610"
        textAlign="center"
        as="kbd"
        whiteSpace="pre-line"
      >
        {
          "We couldn't find any air-cons matching your search criteria.\nPlease adjust your filters and try again."
        }
      </Text>
    </VStack>
  )
}

function FilterPanel({
  results,
  onSubmit,
}: {
  results: Aircon[]
  onSubmit: (data: Filter) => void
}) {
  console.log('FilterPanel renders')
  const [filters, setFilters] = useState<Filter>(INITIAL_FILTERS)

  const handleParamChange = (
    param: keyof Filter,
    value: string | number | boolean,
  ) => {
    console.log('value:', value)
    setFilters({ ...filters, [param]: value })
  }

  console.log('filters state:', filters)

  const handleReset = () => {
    setFilters(INITIAL_FILTERS)
  }

  return (
    <VStack spacing={10} pt={5} alignItems="center">
      <VStack alignItems="center">
        <HStack>
          <TbChecks color="#4F772D" size="25px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Energy Tick Ratings
          </Text>
        </HStack>
        <Select
          w="250px"
          placeholder="Select ticks"
          value={filters.greenTicks}
          bg="#F0F1E7"
          color="#4F772D"
          borderRadius="20px"
          focusBorderColor="#4F772D"
          variant="flushed"
          boxShadow="sm"
          sx={{ textAlign: 'center' }}
          onChange={(e) =>
            handleParamChange('greenTicks', Number(e.target.value))
          }
        >
          {ENERGY_RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </VStack>
      <VStack>
        <HStack>
          <PiMoneyWavyFill color="#4F772D" size="25px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Climate Voucher Eligibility
          </Text>
        </HStack>
        <HStack width="70%">
          <Checkbox
            boxShadow="sm"
            colorScheme="green"
            size="md"
            isChecked={filters.isClimateVoucherEligibleOnly}
            onChange={(e) =>
              handleParamChange(
                'isClimateVoucherEligibleOnly',
                e.target.checked,
              )
            }
          />
          <Text fontSize="sm" color="#4F772D">
            Only show appliances that are eligible for climate vouchers
          </Text>
        </HStack>
      </VStack>
      <VStack>
        <HStack spacing={1}>
          <LuDollarSign color="#4F772D" size="20px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Price
          </Text>
        </HStack>
        <HStack p="0px 40px">
          <NumberInput
            value={filters.maxPrice}
            min={0}
            size="md"
            width="150px"
            color="#4F772D"
            focusBorderColor="#4F772D"
            onChange={(stringValue) =>
              handleParamChange('maxPrice', stringValue)
            }
          >
            <NumberInputField
              bg="#F0F1E7"
              placeholder="Max. price"
              borderRadius="20px"
              boxShadow="sm"
            />
          </NumberInput>
        </HStack>
      </VStack>
      <VStack alignItems="center">
        <HStack>
          <TbAirConditioning color="#4F772D" size="22px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Brands
          </Text>
        </HStack>
        <Select
          w="250px"
          placeholder="Select a brand"
          value={filters.brand}
          bg="#F0F1E7"
          color="#4F772D"
          borderRadius="20px"
          focusBorderColor="#4F772D"
          variant="flushed"
          boxShadow="sm"
          sx={{ textAlign: 'center' }}
          onChange={(e) => handleParamChange('brand', e.target.value)}
        >
          {getAirconBrands(results).map((option, index) => (
            <option key={index} value={option}>
              {capitalizeFirstLetter(option)}
            </option>
          ))}
        </Select>
      </VStack>
      <HStack mt="50px" spacing={15}>
        <Button
          variant="solid"
          backgroundColor="white"
          border="1px"
          borderColor="#253610"
          borderRadius="20px"
          onClick={handleReset}
          boxShadow="base"
        >
          Clear
        </Button>
        <Button
          variant="solid"
          backgroundColor="#4F772D"
          color="#F0F1E7"
          colorScheme="green"
          borderRadius="20px"
          width="150px"
          onClick={() => onSubmit(filters)}
          boxShadow="base"
        >
          Apply
        </Button>
      </HStack>
    </VStack>
  )
}

function EnergyProfileFormWidget({
  onSubmit,
}: {
  onSubmit: (data: ProfileFormValues) => void
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
    <VStack
      backgroundColor="rgba(37, 54, 16)"
      borderRadius="20px"
      p={3}
      boxShadow="lg"
    >
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
            boxShadow="base"
          >
            Update
          </Button>
        </HStack>
      </form>
    </VStack>
  )
}
