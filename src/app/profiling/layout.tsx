import { Grid, GridItem } from '@chakra-ui/react'
import EcoCentsLogo from '../ui/eco-cents-logo'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      templateAreas={`"topnav" "content"`}
      gridTemplateRows={'80px 1fr'}
      minHeight="100vh"
      minWidth="100vh"
      backgroundColor="#253610"
      p="30px"
    >
      <GridItem area={'topnav'}>
        <Link href="/">
          <EcoCentsLogo textColor="#F0F1E7" />
        </Link>
      </GridItem>
      <GridItem area={'content'}>{children}</GridItem>
    </Grid>
  )
}
