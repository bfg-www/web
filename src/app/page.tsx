'use client'

import { Box, Button, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import EcoCentsLogo from '../../public/EcoCentsLogo'
import ecocentsHeroImage from '/public/ecocents-hero-image-openAi.png'
import Link from 'next/link'
import { RoomType } from './models/clientModels'
import { useEffect } from 'react'

// Initialise local storage
const userEnergyProfile = {
  householdType: '4_room',
  airconCount: 2,
  installationLocation: 'bedroom',
  usageHours: 8,
}

const airconResults = [
  {
    id: 1,
    name: 'LG Inverter V',
    brand: 'LG',
    model: 'Inverter V',
    greenTicks: 5,
    annualConsumption: 500,
    price: 500,
    image: '/aircon/stock.png',
    brandLogo: '/brands/lg.svg',
    brandUrl: 'https://www.lg.com/sg/',
    lifecycleCost: 1000,
    lifespanEnergyCost: 1000,
    annualEnergyCost: 1000,
    annualEnergySavings: 1000,
    carbonEmissionsReduced: 9,
  },
  {
    id: 2,
    name: 'Mitsubishi Starmex',
    brand: 'Mitsubishi',
    model: 'Starmex',
    greenTicks: 4,
    annualConsumption: 600,
    price: 600,
    image: '/aircon/stock.png',
    brandLogo: '/brands/mitsubishi.svg',
    brandUrl: 'https://sg.mitsubishielectric.com/',
    lifecycleCost: 900,
    lifespanEnergyCost: 900,
    annualEnergyCost: 900,
    annualEnergySavings: 900,
    carbonEmissionsReduced: 8,
  },
  {
    id: 3,
    name: 'Daikin Inverter',
    brand: 'Daikin',
    model: 'Inverter',
    greenTicks: 3,
    annualConsumption: 700,
    price: 700,
    image: '/aircon/stock.png',
    brandLogo: '/brands/daikin.png',
    brandUrl: 'https://www.daikin.com.sg/',
    lifecycleCost: 800,
    lifespanEnergyCost: 800,
    annualEnergyCost: 800,
    annualEnergySavings: 800,
    carbonEmissionsReduced: 2,
  },
]

const favourites = [
  {
    id: 1,
    name: 'Starmex system 4 aircon',
    brand: 'Mitsubishi',
    model: 'MSY-GE10VA',
    greenTicks: 5,
    annualConsumption: 1000,
    price: 3000,
    image: '/aircon/stock.png',
    brandLogo: '/brands/lg.svg',
    brandUrl: 'https://www.lg.com/sg/',
    lifecycleCost: 5000,
    lifespanEnergyCost: 2000,
    annualEnergyCost: 324.1,
    annualEnergySavings: 0,
    carbonEmissionsReduced: 8,
    airconDetail: {
      url: 'https://www.harveynorman.com.sg/',
      btus: [9000, 9000, 12000, 24000],
      systems: [
        {
          units: [
            {
              roomType: RoomType.bedroom,
              amount: 1,
            },
            {
              roomType: RoomType.living_room,
              amount: 1,
            },
          ],
        },
        {
          units: [
            {
              roomType: RoomType.bedroom,
              amount: 2,
            },
          ],
        },
      ],
    },
  },
]

export default function Landing() {
  //Write to localStorage
  useEffect(() => {
    localStorage.setItem('userEnergyProfile', JSON.stringify(userEnergyProfile))
    localStorage.setItem('airconResults', JSON.stringify(airconResults))
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [])

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
