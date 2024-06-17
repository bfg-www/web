import { Button, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import ecocentsLogo from '/public/ecocents-icon-landing.png'
import ecocentsHeroImage from '/public/ecocents-hero-image-openAi.png'

export default function Landing() {
  return (
    <Grid
      templateAreas={`"tagline hero"`}
      gridTemplateColumns={'2fr 3fr'}
      minHeight="100vh"
      minWidth="100vh"
    >
      <GridItem
        backgroundColor="#F0F1E7"
        area={'tagline'}
        alignContent="center"
      >
        <VStack alignItems="flex-start" p={20}>
          <HStack>
            <Image
              src={ecocentsLogo}
              alt="Logo of web platform"
              width={40}
              height={50}
            />
            <Text fontSize="2xl" color="#253610">
              EcoCents
            </Text>
          </HStack>
          <Text fontSize="4xl" color="#253610">
            Get better energy info.
          </Text>
          <Text fontSize="2xl" color="#4F772D">
            Cost-effective, energy-efficient, and personalised for you. Choosing
            the right green appliance has never been faster.
          </Text>
          <Button
            mt={2}
            size="lg"
            variant="solid"
            alignSelf="self-end"
            colorScheme="green"
          >
            Start
          </Button>
        </VStack>
      </GridItem>
      <GridItem
        backgroundColor="white"
        area={'hero'}
        display="block"
        position="relative"
      >
        <Image src={ecocentsHeroImage} alt="Web platform's hero image" fill />
      </GridItem>
    </Grid>
  )
}
