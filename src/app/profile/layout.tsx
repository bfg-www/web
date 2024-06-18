import { Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import EcoCentsLogo from '../ui/eco-cents-logo'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      templateAreas={`"topnav" "content"`}
      gridTemplateRows={'80px 1fr'}
      minHeight="100vh"
      minWidth="100vh"
      backgroundColor="#F0F1E7"
      p="50px"
    >
      <GridItem area={'topnav'}>
        <HStack spacing={50}>
          <Link href="/">
            <EcoCentsLogo />
          </Link>
          <Link href="/faq">
            <Text fontSize="md" as="b" color="#253610">
              FAQ
            </Text>
          </Link>
        </HStack>
      </GridItem>
      <GridItem borderWidth="1px" borderColor="#253610" area={'content'}>
        {children}
      </GridItem>
    </Grid>
  )
}
