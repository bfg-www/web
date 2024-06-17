import { Button, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import EcoCentsLogo from './ui/eco-cents-logo'
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
          <EcoCentsLogo />
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
      <GridItem backgroundColor="white" area={'hero'} position="relative">
        <Image src={ecocentsHeroImage} alt="Web platform's hero image" fill />
      </GridItem>
    </Grid>
  )
}
