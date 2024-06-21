'use client'

import { Box, Button, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import EcoCentsLogo from '../../public/EcoCentsLogo'
import ecocentsHeroImage from '/public/ecocents-hero-image-openAi.png'
import Link from 'next/link'

// Initialise local storage
const userEnergyProfile = {
  householdType: '4_room',
  airconCount: 2,
  installationLocation: 'bedroom',
  usageHours: 8,
}

const airconResults = [
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
]

const favourites = [
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
]

export default function Landing() {
  //Write to localStorage
  localStorage.setItem('profileFormValues', JSON.stringify(userEnergyProfile))
  localStorage.setItem('airconResults', JSON.stringify(airconResults))
  localStorage.setItem('favourites', JSON.stringify(favourites))

  return (
    <Grid
      templateAreas={`"tagline hero"`}
      gridTemplateColumns={'2fr 3fr'}
      minHeight="100vh"
      minWidth="100vh"
    >
      <GridItem
        backgroundColor="#F0F1E7"
        area={'tagline'}
        alignContent="center"
      >
        <VStack alignItems="flex-start" p={20}>
          <EcoCentsLogo />
          <Text fontSize="4xl" color="#253610">
            Get better energy info.
          </Text>
          <Text fontSize="2xl" color="#4F772D">
            Cost-effective, energy-efficient, and personalised for you. Choosing
            the right green appliance has never been faster.
          </Text>
          <Box alignSelf="flex-end">
            <Link href="/profiling">
              <Button
                mt={2}
                size="lg"
                variant="solid"
                backgroundColor="#253610"
                color="#F0F1E7"
                colorScheme="blackAlpha"
                borderRadius={20}
              >
                Start
              </Button>
            </Link>
          </Box>
        </VStack>
      </GridItem>
      <GridItem backgroundColor="white" area={'hero'} position="relative">
        <Image src={ecocentsHeroImage} alt="Web platform's hero image" fill />
      </GridItem>
    </Grid>
  )
}
