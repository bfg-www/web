'use client'

import EnergyProfileFormWidget from "@/app/ui/profile/EnergyProfileFormWidget";
import { Box, Button, Flex, Grid, GridItem, HStack, Link } from "@chakra-ui/react";
import { FaRegHeart, } from "react-icons/fa";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoOpenOutline } from "react-icons/io5";
import { TbWorldWww } from "react-icons/tb";
import HeartIcon from "@/app/ui/product-details/FavouriteIcon";
import { AirconWithDetail } from "@/app/ui/models/aircon-options";

// JX TODO: I'm not sure how to use the BTUs list to render the Air-con cooling capacity section. I'll put a placeholder for you.
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
    btus: []
}
}

// TOOD: Wire up site redirection to retailer site, product.airconDetail.url?
// TODO: Wire up favourites action to favourites list

export default function Page() {
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
      <GridItem area={'redirections'} pt={5}>
        <HStack justifyContent="space-between">
          <Button variant="link" color="#253610" leftIcon={<RiArrowGoBackLine />}>Back to results</Button>
          <Button variant="link" color="#253610" rightIcon={<IoOpenOutline/>} ><a href="https://www.harveynorman.com.sg/">See retailer site for full specs</a></Button>
        </HStack>
      </GridItem>
      <GridItem bg="pink.300" area={'non-energy-info'} p={3}>
        <Flex justifyContent="flex-end" mt={5} borderWidth="1px">
          <HeartIcon/>
        </Flex>
        <HStack borderWidth="1px">
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
      </GridItem>
      <GridItem bg="blue.300" area={'energy-info'}>
      </GridItem>
    </Grid>
  )

}
