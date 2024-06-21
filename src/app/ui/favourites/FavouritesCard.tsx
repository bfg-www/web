import { Box, Button, HStack, Link, Text, VStack } from '@chakra-ui/react'
import HeartIconRemove from '../product-details/FavouriteIconRemove'
import { IoOpenOutline } from 'react-icons/io5'
import Image from 'next/image'
import { generateTickIcons } from '../profile/ProductCard'
import climateVoucherLogo from '/public/climate-voucher-logo.png'
import { Aircon } from '@/app/models/clientModels'
import CustomTooltip from '../profile/CustomTooltip'

export default function FavouritesCard({ product }: { product: Aircon }) {
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
            Reduce your carbon emissions by up to{' '}
            <strong>{product.carbonEmissionsReduced}%</strong> with this option
            compared to less efficient models
          </Text>
          <Box alignSelf="flex-start">
            <CustomTooltip content="To be added"></CustomTooltip>
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
