'use client'

import EnergyProfileFormWidget from '@/app/ui/profile/EnergyProfileFormWidget'
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FaRegHeart } from 'react-icons/fa'
import { RiArrowGoBackLine } from 'react-icons/ri'
import { IoOpenOutline } from 'react-icons/io5'
import { TbWorldWww } from 'react-icons/tb'
import HeartIcon from '@/app/ui/product-details/FavouriteIcon'
import { AirconWithDetail } from '@/app/ui/models/aircon-options'
import CustomTooltip from '@/app/ui/profile/CustomTooltip'
import { generateTickIcons } from '@/app/ui/profile/ProductCard'
import Image from 'next/image'
import climateVoucherLogo from '/public/climate-voucher-logo.png'
import { capitalizeFirstLetter } from '@/app/ui/helpers'

// JX TODO: I'm not sure how to use the BTUs list to render the Air-con cooling capacity section and the system section. I'll put a placeholder for you.
const AIRCON_WITH_DETAIL: AirconWithDetail = {
  id: 1,
  name: 'starmex system 4 aircon',
  brand: 'mitsubishi',
  model: 'MSY-GE10VA',
  greenTicks: 5,
  annualConsumption: 1000,
  price: 3000,
  image: '',
  brandLogo: '',
  lifecycleCost: 5000,
  lifespanEnergyCost: 2000,
  annualEnergyCost: 324.1,
  annualEnergySavingsAmt: 0,
  carbonEmissionsReduced: 0.5,
  airconDetail: {
    id: 1,
    airconId: 1,
    url: 'https://www.harveynorman.com.sg/',
    btus: [],
  },
}

// TOOD: Wire up site redirection to retailer site, product.airconDetail.url?
// TODO: Wire up favourites action to favourites list

export default function Page({
  product = AIRCON_WITH_DETAIL,
}: {
  product: AirconWithDetail
}) {
  const isClimateVoucherEligible = product.greenTicks === 5
  return (
    <Grid
      templateAreas={`"personal" "redirections" "non-energy-info" "energy-info"`}
      gridTemplateRows={'100px 50px 1fr 2fr'}
      minHeight="100vh"
      minWidth="100vh"
      borderWidth="1px"
    >
      <GridItem area={'personal'}>
        <HStack justifyContent="space-between">
          <EnergyProfileFormWidget isEditable={false} />
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
      <GridItem area={'redirections'} pt={4}>
        <HStack justifyContent="space-between">
          <Button
            variant="link"
            color="#253610"
            leftIcon={<RiArrowGoBackLine />}
          >
            Back to results
          </Button>
          <Button variant="link" color="#253610" rightIcon={<IoOpenOutline />}>
            <a href="https://www.harveynorman.com.sg/">
              See retailer site for full specs
            </a>
          </Button>
        </HStack>
      </GridItem>
      <GridItem
        borderTopRightRadius="15px"
        borderTopLeftRadius="15px"
        bg="white"
        area={'non-energy-info'}
        px={4}
        py={2}
      >
        <Flex justifyContent="flex-end" mt={5} borderWidth="1px">
          <HeartIcon />
        </Flex>
        <HStack borderWidth="1px">
          <Box borderWidth="1px" width="40%">
            INSERT AIRCON IMAGE
          </Box>
          <VStack
            borderWidth="1px"
            width="100%"
            spacing={0}
            alignItems="flex-start"
          >
            <HStack borderWidth="1px" alignItems="flex-start">
              <Box>INSERT BRAND LOGO</Box>
              <Text fontSize="lg">{capitalizeFirstLetter(product.brand)}</Text>
            </HStack>
            <Text as="b" fontSize="lg">
              {product.name.toUpperCase()}
            </Text>
            <Text fontSize="sm" color="grey">
              {product.model.toUpperCase()}
            </Text>
            <VStack
              borderWidth="1px"
              borderRadius="15px"
              bg="#253610"
              alignItems="flex-start"
            >
              <VStack alignItems="flex-start">
                <Flex>
                  <Text as="b" fontSize="lg" color="#F0F1E7">
                    Air-con cooling capacity
                  </Text>
                  <CustomTooltip content="To be added" color="#F0F1E7" />
                </Flex>
                <Text fontSize="lg" color="#F0F1E7">
                  {'[JX TODO: Show BTU units here]'} <strong>BTU</strong>
                </Text>
              </VStack>
              <VStack
                borderTop="1px"
                borderWidth="80%"
                borderColor="#F0F1E7"
                alignItems="flex-start"
              >
                <Text color="#F0F1E7" as="b" fontSize="md">
                  This system-{'[JX TODO: INSERT SYSTEM UNIT]'} unit consists
                  of:
                </Text>
                <Text color="#F0F1E7">
                  JX TODO: get system-to-room mapping unit info
                </Text>
              </VStack>
            </VStack>
          </VStack>
        </HStack>
      </GridItem>
      <GridItem area={'energy-info'} bg="white" px={4} pt={2}>
        <VStack
          bg="white"
          borderRadius="15px"
          alignItems="flex-start"
          width="100%"
          borderWidth="1px"
        >
          <VStack alignItems="flex-start" width="100%" px={5} py={0} rowGap={0}>
            <HStack
              spacing={5}
              width="100%"
              borderTopRightRadius="15px"
              borderTopLeftRadius="15px"
              py={3}
            >
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
            <Text as="kbd" size="lg" color="#253610">
              What's in an air-con purchase?
            </Text>
          </VStack>
          <VStack
            bg="#4F772D"
            alignSelf="flex-start"
            width="100%"
            borderTopRightRadius="15px"
            borderTopLeftRadius="15px"
            px={5}
            alignItems="flex-start"
            rowGap={1}
          >
            <Text as="kbd" size="lg" color="#F0F1E7" pt={2}>
              Over a year
            </Text>
            <Flex>
              <Text as="b" size="lg" color="#F0F1E7" p={0}>
                Annual Energy Costs
              </Text>
              <CustomTooltip content="To be added" color="#F0F1E7" />
            </Flex>
            <Text as="b" size="lg" color="#F0F1E7" p={0}>
              ${product.annualEnergyCost}
            </Text>
          </VStack>
        </VStack>
      </GridItem>
    </Grid>
  )
}

{
  /* <HStack alignSelf="flex-start" spacing="150px" borderWidth="1px">
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
          </HStack> */
}
