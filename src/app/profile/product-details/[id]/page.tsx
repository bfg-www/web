'use client'

import EnergyProfileFormWidget from "@/app/ui/profile/EnergyProfileFormWidget";
import { Button, Flex, Grid, GridItem, HStack, Link } from "@chakra-ui/react";
import { FaRegHeart, } from "react-icons/fa";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoOpenOutline } from "react-icons/io5";
import { TbWorldWww } from "react-icons/tb";
import HeartIcon from "@/app/ui/product-details/FavouriteIcon";


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
        <HStack borderWidth="1px"></HStack>
      </GridItem>
      <GridItem bg="blue.300" area={'energy-info'}>
      </GridItem>
    </Grid>
  )

}
