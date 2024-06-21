'use client'
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { RiArrowGoBackLine } from 'react-icons/ri'
import EnergyProfileFormWidget from '@/app/ui/profile/EnergyProfileFormWidget'
import HeartIconRemove from '@/app/ui/product-details/FavouriteIconRemove'
import { IoOpenOutline } from 'react-icons/io5'
import Image from 'next/image'
import { Aircon } from '@/app/models/clientModels'
import { generateTickIcons } from '@/app/ui/profile/ProductCard'
import climateVoucherLogo from '/public/climate-voucher-logo.png'
import CustomTooltip from '@/app/ui/profile/CustomTooltip'

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

function FavouritesCard({ product }: { product: Aircon }) {
  const isClimateVoucherEligible = product.greenTicks === 5
  return (
    <VStack
      bg="white"
      width="300px"
      borderRadius="10px"
      pb={4}
      boxShadow="base"
    >
      <HStack justifyContent="space-between" width="100%" px={5} py={2}>
        <HeartIconRemove />
        <Button
          variant="link"
          rightIcon={<IoOpenOutline size="12px" />}
          iconSpacing={1}
        >
          <Link href={product.brandUrl} fontSize="10px" target="_blank">
            See retailer site for full specs
          </Link>
        </Button>
      </HStack>
      <Image
        src={product.image}
        width="300"
        height="100"
        alt="Picture of an air-conditione "
      ></Image>
      <VStack width="100%" spacing={0} justifyContent="center">
        <HStack>
          <Image
            src={product.brandLogo}
            alt="Logo of an air-conditioner brand"
            width="40"
            height="40"
          ></Image>
          <Text fontSize="sm">{product.model}</Text>
        </HStack>
        <Text as="b" fontSize="sm">
          {product.name.toUpperCase()}
        </Text>
        <Text fontSize="xs" color="grey">
          {product.model.toUpperCase()}
        </Text>
        <HStack justifyContent="center" spacing={5} mt={2}>
          <HStack spacing={0}>
            {generateTickIcons(Number(product.greenTicks), '15px')}
          </HStack>
          {isClimateVoucherEligible && (
            <Box width="100px" borderRadius="15px" boxShadow="base">
              <Image
                src={climateVoucherLogo}
                alt="Logo of government-issued climate vouchers"
                width={150}
              />
            </Box>
          )}
        </HStack>
        <HStack
          backgroundColor="green.500"
          spacing={0}
          width="100%"
          p={2}
          mt={4}
          sx={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
        >
          <Text fontSize="xs" color="#F0F1E7" as="kbd" ml={2} mr={1}>
            This unit emits{' '}
            <strong>{product.carbonEmissionsReduced}% less CO2 </strong>{' '}
            compared to the average 3-tick air-con unit in the market
          </Text>
          <Box alignSelf="flex-start">
            <CustomTooltip content="Unit lifecycle emissions are calculated per lifetime of the unit (7 years) and based on factors such as air-con capacity, usage hours and the average amount of CO2 emitted to produce one unit of electricity in Singapore (source: Energy Market Authority)."></CustomTooltip>
          </Box>
        </HStack>
        <VStack spacing={3} mt={3}>
          <VStack justifyContent="center" spacing={0}>
            <Text fontSize="sm" color="#253610">
              Annual energy cost
            </Text>
            <Text width="auto" as="b" fontSize="sm" color="#253610">
              ${product.annualEnergyCost}
            </Text>
          </VStack>
          <VStack justifyContent="center" spacing={0} width="100%">
            <Text fontSize="sm" color="#253610" p={0}>
              Lifetime energy cost
            </Text>
            <Text width="auto" as="b" fontSize="sm" color="#253610">
              ${product.lifespanEnergyCost}
            </Text>
          </VStack>
        </VStack>
      </VStack>
      <Box alignSelf="flex-end">
        <Link href={`profile/product-details/${product.id}`}>
          <Button
            backgroundColor="#F0F1E7"
            color="#253610"
            borderRadius="16px"
            mr={2}
            boxShadow="base"
            size="sm"
            iconSpacing={1}
          >
            Go to details
          </Button>
        </Link>
      </Box>
    </VStack>
  )
}
