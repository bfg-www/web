
import { Grid, GridItem } from "@chakra-ui/react";


export default function Page() {
    return (
        <Grid
      templateAreas={`"personal" "redirections" "non-energy-info" "energy-info"`}
      gridTemplateRows={'100px 100px 1fr 2fr'}
      minHeight="100vh"
      minWidth="100vh"
      columnGap={5}
      borderWidth="1px"
    >
      <GridItem area={'personal'}>
      </GridItem>
      <GridItem bg="orange.300"area={'redirections'}>
      </GridItem>
      <GridItem bg="pink.300" area={'non-energy-info'}>
      </GridItem>
      <GridItem bg="blue.300" area={'energy-info'}>
      </GridItem>
    </Grid>
  )

}


{/* <HStack justifyContent="space-between">
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
        </HStack> */}