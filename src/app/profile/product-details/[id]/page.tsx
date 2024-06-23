'use client'

import EnergyProfileFormWidget from '@/app/ui/profile/EnergyProfileFormWidget'
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FaHeart } from 'react-icons/fa'
import { RiArrowGoBackLine } from 'react-icons/ri'
import { IoOpenOutline } from 'react-icons/io5'
import HeartIconAdd from '@/app/ui/product-details/FavouriteIconAdd'
import {
  AirconWithDetail,
  ProfileFormValues,
  RoomType,
} from '@/app/models/clientModels'
import CustomTooltip from '@/app/ui/profile/CustomTooltip'
import { generateTickIcons } from '@/app/ui/profile/ProductCard'
import Image from 'next/image'
import climateVoucherLogo from '/public/climate-voucher-logo.png'
import Link from 'next/link'
import { capitalizeFirstLetter } from '@/app/ui/helpers'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAirconDetail } from '@/app/lib/aircon'

// export const AIRCON_WITH_DETAIL: AirconWithDetail = {
//   id: 1,
//   name: 'Starmex system 4 aircon',
//   brand: 'Mitsubishi',
//   model: 'MSY-GE10VA',
//   greenTicks: 5,
//   annualConsumption: 1000,
//   price: 3000,
//   image: '/aircon/stock.png',
//   brandLogo: '/brands/lg.svg',
//   brandUrl: 'https://www.lg.com/sg/',
//   lifecycleCost: 5000,
//   lifespanEnergyCost: 2000,
//   annualEnergyCost: 324.1,
//   annualEnergySavings: 0,
//   carbonEmissionsReduced: 0.5,
//   airconDetail: {
//     url: 'https://www.harveynorman.com.sg/',
//     btus: [9000, 9000, 12000, 24000],
//     systems: [
//       {
//         units: [
//           {
//             roomType: RoomType.bedroom,
//             amount: 1,
//           },
//           {
//             roomType: RoomType.living_room,
//             amount: 1,
//           },
//         ],
//       },
//       {
//         units: [
//           {
//             roomType: RoomType.bedroom,
//             amount: 2,
//           },
//         ],
//       },
//     ],
//   },
// }

// TOOD: Wire up site redirection to retailer site, product.airconDetail.url?
// TODO: Wire up favourites action to favourites list

export default function Page() {
  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()
  const [product, setProduct] = useState<AirconWithDetail>()
  const [isClimateVoucherEligible, setIsClimateVoucherEligible] =
    useState(false)
  const [btuFrequencies, setBtuFrequencies] = useState<Record<number, number>>(
    {},
  )

  useEffect(() => {
    async function fetchProduct() {
      if (id == null) {
        router.push('/profile')
      }
      try {
        let profile: ProfileFormValues = {
          householdType: '1-Room',
          airconCount: '1',
          installationLocation: 'Bedroom',
          usageHours: '8',
        }
        if (typeof window !== 'undefined') {
          profile = JSON.parse(
            localStorage.getItem('userEnergyProfile') || '{}',
          )
        }
        const res = await getAirconDetail(
          id,
          Number(profile.usageHours),
          RoomType[profile.installationLocation as keyof typeof RoomType],
        )
        setProduct(res)
        setIsClimateVoucherEligible(res.greenTicks === 5)
        const btuFrequencies = res.airconDetail.btus.reduce((acc, btu) => {
          acc[btu] = acc[btu] ? acc[btu] + 1 : 1
          return acc
        }, {} as Record<number, number>)
        setBtuFrequencies(btuFrequencies)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProduct()
  }, [router, id])

  return (
    <>
      {!product && (
        <Skeleton
          height="100%"
          width="100%"
          startColor="#F0F1E7"
          endColor="white"
          borderRadius="15px"
        />
      )}
      {product && (
        <Grid
          templateAreas={`"redirect-back" "personal" "redirect-out" "non-energy-info" "energy-info"`}
          gridTemplateRows={'10px 100px 50px 1fr 1fr'}
          minHeight="100vh"
          minWidth="100vh"
        >
          <GridItem area="redirect-back">
            <Link href="/profile">
              <Button
                variant="link"
                color="#253610"
                leftIcon={<RiArrowGoBackLine />}
              >
                Back to results
              </Button>
            </Link>
          </GridItem>
          <GridItem area={'personal'}>
            <HStack justifyContent="space-between" mt={10}>
              <EnergyProfileFormWidget isEditable={false} onSubmit={() => {}} />
              <Link href="/profile/favourites">
                <Button
                  type="submit"
                  size="md"
                  variant="solid"
                  backgroundColor="#253610"
                  color="#F0F1E7"
                  colorScheme="blackAlpha"
                  borderRadius="15px"
                  rightIcon={<FaHeart />}
                  boxShadow="base"
                >
                  Favourites
                </Button>
              </Link>
            </HStack>
          </GridItem>
          <GridItem area={'redirect-out'}>
            <HStack justifyContent="flex-end" pt={6}>
              <Button
                variant="link"
                color="#253610"
                rightIcon={<IoOpenOutline />}
              >
                <a href={product.brandUrl}>See retailer site for full specs</a>
              </Button>
            </HStack>
          </GridItem>
          <GridItem
            borderTopRightRadius="15px"
            borderTopLeftRadius="15px"
            bg="white"
            area={'non-energy-info'}
            px={4}
            pt={2}
            pb={6}
          >
            <Flex justifyContent="flex-end">
              <CustomTooltip
                content="Our data is retrieved from the National Environmental Agency (NEA)'s database of registered goods. They update daily, which means so will we. Sales data is currently mocked for this MVP but stay tuned as we hunt for data. Contact us for corporate partnerships at bfgw3energy@gmail.com."
                color="#253610"
                iconType="info"
              />
            </Flex>
            <Flex justifyContent="flex-end" mt={3} pr={3}>
              <HeartIconAdd product={product} />
            </Flex>
            <HStack spacing={10}>
              <Image
                src={product.image}
                alt="Image of an air-conditioner"
                width="600"
                height="300"
              ></Image>
              <VStack width="100%" spacing={1} alignItems="flex-start">
                <HStack alignItems="center">
                  <Image
                    src={product.brandLogo}
                    alt="Logo of an air-conditioner brand"
                    width="50"
                    height="50"
                  ></Image>
                  <Text fontSize="lg">{product.brand}</Text>
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
                  <VStack alignItems="flex-start" width="500px">
                    <Flex>
                      <Text as="b" fontSize="lg" color="#F0F1E7">
                        Air-con cooling capacity
                      </Text>
                      <CustomTooltip
                        content="BTU (British Thermal Unit) is a way to measure energy. This measures how much heat energy your aircon is removing per hour. The smaller the space, the smaller the BTU required."
                        color="#F0F1E7"
                      />
                    </Flex>
                    <Text fontSize="lg" color="#F0F1E7">
                      {Object.entries(btuFrequencies).map(
                        ([btu, frequency], index) => (
                          <Text key={index}>
                            {frequency} x <strong>{btu}</strong> BTU
                          </Text>
                        ),
                      )}{' '}
                    </Text>
                  </VStack>
                  <VStack
                    borderTop="1px"
                    borderColor="#F0F1E7"
                    alignItems="flex-start"
                    width="100%"
                    pt={2}
                  >
                    <Text color="#F0F1E7" fontSize="md">
                      This{' '}
                      <strong>system-{product.airconDetail.btus.length}</strong>{' '}
                      unit consists of:
                    </Text>
                    {product.airconDetail.systems.map((system, index) => (
                      <HStack width="100%" key={index}>
                        <HStack>
                          {system.units.map((unit) => (
                            <Text color="#F0F1E7" key={unit.roomType}>
                              {unit.amount}{' '}
                              <strong>
                                {capitalizeFirstLetter(unit.roomType)}
                              </strong>
                            </Text>
                          ))}
                        </HStack>
                        {index < product.airconDetail.systems.length - 1 ? (
                          <Text color="#F0F1E7">OR</Text>
                        ) : null}
                      </HStack>
                    ))}
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
                mt={6}
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
                      Annual energy cost
                    </Text>
                    <CustomTooltip
                      content="This cost is calculated based on your air-con usage levels, the capacity of the air-con and the efficiency of the air-con unit. We used $0.32/kWh as the price of electricity (source: Energy Market Authority)."
                      color="#F0F1E7"
                    />
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
                        Lifecycle cost
                      </Text>
                      <CustomTooltip
                        content="This cost is calculated based on your air-con usage levels and it indicates the total cost of this appliance over its lifespan. It is calculated with the formula: Life Cycle Cost = Price + Energy Cost to run air-con for 7 years."
                        color="#F0F1E7"
                      />
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
                        Lifetime energy cost
                      </Text>
                      <CustomTooltip
                        content="This cost is calculated based on your air-con usage levels and it indicates the total cost of this appliance over its lifespan, excluding the retail price. It is calculated with the formula: Energy Cost to run air-con for 7 years."
                        color="#F0F1E7"
                      />
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
      )}
    </>
  )
}
