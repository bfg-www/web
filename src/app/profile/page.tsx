'use client'
import { Grid, GridItem, HStack } from '@chakra-ui/react'

// TODO: Mock user data to be stored in localStorage later

const USER_ENERGY_PROFILE = {
  householdType: 'four_room',
  airconCount: '2',
  installationLocation: 'bedroom',
  usageHours: '8',
}

const RESULTS = [
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
  householdType: USER_ENERGY_PROFILE.householdType,
  airconCount: Number(USER_ENERGY_PROFILE.airconCount),
  installationLocation: USER_ENERGY_PROFILE.installationLocation,
  usageHours: Number(USER_ENERGY_PROFILE.usageHours),
  greenTicks: 0,
  isClimateVoucherEligibleOnly: false,
  maxPrice: '',
  brand: '',
}

// Page component should handle
export default function Page() {
  return (
    <Grid
      templateAreas={`"personal personal" "filter results"`}
      gridTemplateRows={'100px 1fr'}
      gridTemplateColumns={'1fr 2fr'}
      minHeight="100vh"
      minWidth="100vh"
    >
      <GridItem bg="blue.300" area={'personal'}>
        <EnergyProfileFilterWidget />
      </GridItem>
      <GridItem bg="orange.300" area={'filter'}>
        filter
      </GridItem>
      <GridItem bg="pink.300" area={'results'}>
        results
      </GridItem>
    </Grid>
  )
}

// ************* JX TODO: add getDummyAircon(data) to update button ************* //
function EnergyProfileFormWidget() {
  return <HStack backgroundColor="#F0F1E7"></HStack>
}
