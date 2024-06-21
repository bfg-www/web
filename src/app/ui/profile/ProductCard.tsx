import { Aircon } from '@/app/models/clientModels'
import { Box, Button, Flex, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { FaEarthAsia } from 'react-icons/fa6'
import CustomTooltip from './CustomTooltip'
import climateVoucherLogo from '/public/climate-voucher-logo.png'
import Image from 'next/image'
import { GiCheckMark } from 'react-icons/gi'

/* JX TODO: Please check if  id in the NextJS link to product-details is correct, see 'Find out more' btn. 
Not sure if it's product.id or product.airconDetail.id */
export function generateTickIcons(count: number, tickSize = '25px') {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <GiCheckMark size={tickSize} key={index} color="#4F772D" />
      ))}
    </>
  )
}

export default function ProductCard({
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
      height="310px"
      borderRadius="15px"
      p={3}
      boxShadow="base"
      mb={5}
      spacing={1}
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
            This unit emits{' '}
            <strong>{product.carbonEmissionsReduced}% less CO2 </strong>{' '}
            compared to the average 3-tick air-con unit in the market
          </Text>
          <CustomTooltip content="Unit lifecycle emissions are calculated per lifetime of the unit (7 years) and based on factors such as air-con capacity, usage hours and the average amount of CO2 emitted to produce one unit of electricity in Singapore (source: Energy Market Authority)."></CustomTooltip>
        </HStack>
        {showTopChoiceTag && (
          <Text
            background="green.300"
            fontSize="xs"
            color="#F0F1E7"
            borderRadius="15px"
            as="b"
            p={2}
          >
            Top choice!
          </Text>
        )}
      </Flex>
      <HStack justifyContent="flex-start" width="100%" mt={1}>
        <Image
          src={product.image}
          alt="Image of an air-conditioner"
          width="500"
          height="200"
        ></Image>
        <VStack width="100%" mt={0} spacing={0} ml={5}>
          <HStack alignSelf="flex-start">
            <Image
              src={product.brandLogo}
              alt="Picture of an air-conditioner"
              width="50"
              height="50"
            ></Image>
            <Text fontSize="lg">{product.brand}</Text>
          </HStack>
          <Text as="b" fontSize="lg" alignSelf="flex-start">
            {product.name.toUpperCase()}
          </Text>
          <Text fontSize="sm" alignSelf="flex-start" color="grey">
            {product.model.toUpperCase()}
          </Text>
          <HStack alignSelf="flex-start" spacing="50px" mt={5}>
            <VStack>
              <Text fontSize="lg">Price</Text>
              <Text as="b" fontSize="lg">
                ${product.price}
              </Text>
            </VStack>
            <VStack>
              <Flex>
                <Text fontSize="lg">Lifecycle cost</Text>
                <CustomTooltip
                  content="This cost is calculated based on your air-con usage levels and it indicates the total cost of this appliance over its lifespan. It is calculated with the formula: Life Cycle Cost = Price + Energy Cost to run air-con for 7 years."
                  color="#253610"
                />
              </Flex>
              <Text as="b" fontSize="lg">
                ${product.lifecycleCost}
              </Text>
            </VStack>
            <VStack>
              <Flex>
                <Text fontSize="lg">Annual energy cost</Text>
                <CustomTooltip
                  content="This cost is calculated based on your air-con usage levels, the capacity of the air-con and the efficiency of the air-con unit. We used $0.32/kWh as the price of electricity (source: Energy Market Authority)."
                  color="#253610"
                />
              </Flex>
              <Text as="b" fontSize="lg">
                ${product.annualEnergyCost}
              </Text>
            </VStack>
          </HStack>
          <HStack alignSelf="flex-start" spacing={5} mt={5}>
            <HStack spacing={0}>
              {generateTickIcons(Number(product.greenTicks))}
            </HStack>
            {isClimateVoucherEligible && (
              <Box width="100px" borderRadius="15px" boxShadow="base">
                <Image
                  src={climateVoucherLogo}
                  alt="Logo of government-issued climate vouchers"
                />
              </Box>
            )}
          </HStack>
          <Box width="100%" display="flex" justifyContent="flex-end">
            <Link href={`profile/product-details/${product.id}`}>
              <Button
                backgroundColor="#F0F1E7"
                color="#253610"
                borderRadius="16px"
                p={3}
                boxShadow="base"
                size="sm"
              >
                Find out more
              </Button>
            </Link>
          </Box>
        </VStack>
      </HStack>
    </VStack>
  )
}
