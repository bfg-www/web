'use client'
import { Button, Grid, GridItem, HStack, Link, Text } from '@chakra-ui/react'
import { RiArrowGoBackLine } from 'react-icons/ri'
import EnergyProfileFormWidget from '@/app/ui/profile/EnergyProfileFormWidget'

import FavouritesCard from '@/app/ui/favourites/FavouritesCard'

// TODO: replace with real data from local storage

const dummyFavourites = [
  {
    annualConsumption: 500,
    annualEnergyCost: 1000,
    annualEnergySavings: 1000,
    brand: 'LG',
    brandLogo: '/brands/lg.svg',
    brandUrl: 'https://www.lg.com/sg/',
    carbonEmissionsReduced: 1000,
    greenTicks: 5,
    id: 1,
    image: '/aircon/stock.png',
    lifecycleCost: 1000,
    lifespanEnergyCost: 1000,
    model: 'Inverter V',
    name: 'LG Inverter V',
    price: 500,
  },
  {
    annualConsumption: 500,
    annualEnergyCost: 1000,
    annualEnergySavings: 1000,
    brand: 'LG',
    brandLogo: '/brands/lg.svg',
    brandUrl: 'https://www.lg.com/sg/',
    carbonEmissionsReduced: 1000,
    greenTicks: 5,
    id: 2,
    image: '/aircon/stock.png',
    lifecycleCost: 1000,
    lifespanEnergyCost: 1000,
    model: 'Inverter V',
    name: 'LG Inverter V',
    price: 500,
  },
  {
    annualConsumption: 500,
    annualEnergyCost: 1000,
    annualEnergySavings: 1000,
    brand: 'LG',
    brandLogo: '/brands/lg.svg',
    brandUrl: 'https://www.lg.com/sg/',
    carbonEmissionsReduced: 1000,
    greenTicks: 5,
    id: 3,
    image: '/aircon/stock.png',
    lifecycleCost: 1000,
    lifespanEnergyCost: 1000,
    model: 'Inverter V',
    name: 'LG Inverter V',
    price: 500,
  },
]

const dummyFavourite = {
  annualConsumption: 500,
  annualEnergyCost: 1000,
  annualEnergySavings: 1000,
  brand: 'LG',
  brandLogo: '/brands/lg.svg',
  brandUrl: 'https://www.lg.com/sg/',
  carbonEmissionsReduced: 1000,
  greenTicks: 5,
  id: 3,
  image: '/aircon/stock.png',
  lifecycleCost: 1000,
  lifespanEnergyCost: 1000,
  model: 'Inverter V',
  name: 'LG Inverter V',
  price: 500,
}

export default function Page() {
  return (
    <Grid
      templateAreas={`"heading" "personal" "favourites-list"`}
      gridTemplateRows={'70px 80px 1fr'}
      minHeight="100vh"
      minWidth="100vh"
      p={3}
    >
      <GridItem area={'heading'}>
        <HStack justifyContent="space-between">
          <Text as="b" fontSize="3xl" color="#253610">
            MY FAVOURITES
          </Text>
          <Link href="/profile">
            <Button
              variant="link"
              color="#253610"
              leftIcon={<RiArrowGoBackLine />}
              size="sm"
            >
              Back to results
            </Button>
          </Link>
        </HStack>
      </GridItem>
      <GridItem area={'personal'}>
        <HStack>
          <EnergyProfileFormWidget isEditable={false} />
        </HStack>
      </GridItem>
      <GridItem area={'favourites-list'} mt={10}>
        <HStack width="100%" alignContent="flex-start" columnGap={50}>
          {dummyFavourites.map((dummyFavourite, index) => (
            <FavouritesCard key={index} product={dummyFavourite} />
          ))}
        </HStack>
      </GridItem>
    </Grid>
  )
}
