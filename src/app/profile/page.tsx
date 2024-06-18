import { Grid, GridItem } from '@chakra-ui/react'
import Link from 'next/link'

export default function Page() {
  return (
    <Grid
      templateAreas={`"personal personal" "filter results"`}
      gridTemplateRows={'100px 1fr'}
      gridTemplateColumns={'1fr 2fr'}
      minHeight="100vh"
      minWidth="100vh"
    >
      <GridItem bg="blue.300" area={'personal'}>
        personal
      </GridItem>
      <GridItem bg="orange.300" area={'filter'}>
        filter
      </GridItem>
      <GridItem bg="pink.300" area={'results'}>
        results
      </GridItem>
    </Grid>
  )
}
