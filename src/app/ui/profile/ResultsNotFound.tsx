import { Text, VStack } from '@chakra-ui/react'
import { TbFaceIdError } from 'react-icons/tb'

export default function ResultsNotFound() {
  return (
    <VStack
      height="100%"
      width="100%"
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      <TbFaceIdError color="#4F772D" size="70px" />
      <Text fontSize="md" color="#4F772D" as="kbd">
        No results found
      </Text>
      <Text
        fontSize="md"
        color="#253610"
        textAlign="center"
        as="kbd"
        whiteSpace="pre-line"
      >
        {
          "We couldn't find any air-cons matching your search criteria.\nPlease adjust your filters and try again."
        }
      </Text>
    </VStack>
  )
}
