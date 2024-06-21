'use client'

import EnergyProfileFormWidget from '@/app/ui/profile/EnergyProfileFormWidget'
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
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
import HeartIconAdd from '@/app/ui/product-details/FavouriteIconAdd'
import { AirconWithDetail } from '@/app/models/clientModels'
import CustomTooltip from '@/app/ui/profile/CustomTooltip'
import { generateTickIcons } from '@/app/ui/profile/ProductCard'
import Image from 'next/image'
import climateVoucherLogo from '/public/climate-voucher-logo.png'
import { capitalizeFirstLetter } from '@/app/ui/helpers'

// JX TODO: I'm not sure how to use the BTUs list to render the Air-con cooling capacity section and the system section. I'll put a placeholder for you.
export const AIRCON_WITH_DETAIL: AirconWithDetail = {
  id: 1,
  name: 'starmex system 4 aircon',
  brand: 'mitsubishi',
  model: 'MSY-GE10VA',
  greenTicks: 5,
  annualConsumption: 1000,
  price: 3000,
  image: '',
  brandLogo: '',
  brandUrl: '',
  lifecycleCost: 5000,
  lifespanEnergyCost: 2000,
  annualEnergyCost: 324.1,
  annualEnergySavings: 0,
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
      templateAreas={`"redirect-back" "personal" "redirect-out" "non-energy-info" "energy-info"`}
      gridTemplateRows={'10px 100px 50px 1fr 2fr'}
      minHeight="100vh"
      minWidth="100vh"
    >
      <GridItem area="redirect-back">
        <Button variant="link" color="#253610" leftIcon={<RiArrowGoBackLine />}>
          Back to recommendations
        </Button>
      </GridItem>
      <GridItem area={'personal'}>
        <HStack justifyContent="space-between" mt={10}>
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
      <GridItem area={'redirect-out'}>
        <HStack justifyContent="flex-end" pt={6}>
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
        <Flex justifyContent="flex-end" mt={5} pr={2}>
          <HeartIconAdd />
        </Flex>
        <HStack>
          <Box borderWidth="1px" width="40%">
            INSERT AIRCON IMAGE
          </Box>
          <VStack
            borderWidth="1px"
            width="100%"
            spacing={1}
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
              borderRadius="15px"
              bg="#4F772D"
              boxShadow="base"
              alignItems="flex-start"
              p={3}
              mt={5}
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
      <GridItem
        area={'energy-info'}
        bg="white"
        px={4}
        pt={2}
        borderBottomRadius="15px"
      >
        <VStack
          borderRadius="15px"
          alignItems="flex-start"
          width="100%"
          rowGap={0}
          bg="white"
        >
          <VStack
            alignItems="flex-start"
            width="100%"
            height="auto"
            px={5}
            mt={14}
            rowGap={0}
            bg="white"
            borderTopRightRadius="15px"
            borderTopLeftRadius="15px"
            sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) -1.95px -1.95px 15px' }}
          >
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
            <Text as="kbd" fontSize="md" color="#253610">
              <strong>What's in an air-con purchase?</strong>
            </Text>
          </VStack>
          <VStack
            bg="#253610"
            alignSelf="flex-start"
            width="100%"
            height="100%"
            borderTopRightRadius="15px"
            borderTopLeftRadius="15px"
            px={5}
            pb={5}
            alignItems="flex-start"
            rowGap={1}
            sx={{ boxShadow: 'rgba(0, 0, 0, 0.3) -1.95px -1.95px 10px' }}
          >
            <Text as="kbd" fontSize="md" color="#F0F1E7" pt={2}>
              Over a year
            </Text>
            <VStack justifyContent="center">
              <Flex>
                <Text as="b" fontSize="lg" color="#F0F1E7">
                  Annual Energy Costs
                </Text>
                <CustomTooltip content="To be added" color="#F0F1E7" />
              </Flex>
              <Text
                width="auto"
                as="b"
                fontSize="lg"
                color="#F0F1E7"
                p={0}
                alignSelf="center"
              >
                ${product.annualEnergyCost}
              </Text>
            </VStack>
          </VStack>
          <VStack
            bg="#253610"
            alignSelf="flex-start"
            width="100%"
            height="150px"
            borderRadius="15px"
            px={5}
            mt={-1}
            alignItems="flex-start"
            spacing={0}
            sx={{ boxShadow: 'rgba(0, 0, 0, 0.3) -1.95px -1.95px 10px' }}
          >
            <Text as="kbd" fontSize="md" color="#F0F1E7" pt={2}>
              Over the air-con's lifetime
            </Text>
            <HStack spacing={10} width="100%" height="100%">
              <VStack borderRightWidth={1}>
                <Flex mr={5}>
                  <Text as="b" fontSize="xl" color="#F0F1E7">
                    Lifecycle Cost
                  </Text>
                  <CustomTooltip content="To be added" color="#F0F1E7" />
                </Flex>
                <Text
                  width="auto"
                  as="b"
                  fontSize="lg"
                  color="#F0F1E7"
                  alignSelf="center"
                >
                  ${product.lifecycleCost}
                </Text>
              </VStack>
              <VStack>
                <Text as="b" fontSize="xl" color="#F0F1E7">
                  Price
                </Text>
                <Text
                  width="auto"
                  as="b"
                  fontSize="lg"
                  color="#F0F1E7"
                  p={0}
                  alignSelf="center"
                >
                  ${product.price}
                </Text>
              </VStack>
              <Text as="b" fontSize="xl" color="#F0F1E7">
                +
              </Text>
              <VStack>
                <Flex>
                  <Text as="b" fontSize="xl" color="#F0F1E7" p={0}>
                    Lifetime Energy Cost
                  </Text>
                  <CustomTooltip content="To be added" color="#F0F1E7" />
                </Flex>
                <Text
                  width="auto"
                  as="b"
                  fontSize="lg"
                  color="#F0F1E7"
                  p={0}
                  alignSelf="center"
                >
                  ${product.lifespanEnergyCost}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </GridItem>
    </Grid>
  )
}
