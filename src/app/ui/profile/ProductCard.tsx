import { Aircon } from '@/app/models/clientModels'
import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { FaEarthAsia } from 'react-icons/fa6'
import CustomTooltip from './CustomTooltip'
import { capitalizeFirstLetter } from '../helpers'
import climateVoucherLogo from '/public/climate-voucher-logo.png'
import Image from 'next/image'
import { GiCheckMark } from 'react-icons/gi'

function generateTickIcons(count: number) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <GiCheckMark size="25px" key={index} color="#4F772D" />
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
