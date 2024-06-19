import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Text,
  VStack,
} from '@chakra-ui/react'
import EducationTidbit from './EducationTidbit'
import Link from 'next/link'
import { BiSolidRightArrow } from 'react-icons/bi'

export default function FullscreenSpinner({
  progress,
  showLoadingText,
}: {
  progress: number
  showLoadingText: boolean
}) {
  return (
    <VStack
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress
        value={progress}
        trackColor="#4F772D"
        color="#F0F1E7"
        size="180px"
        thickness="7px"
      >
        <CircularProgressLabel
          color="#F0F1E7"
          fontSize="30px"
        >{`${progress}%`}</CircularProgressLabel>
      </CircularProgress>
      {showLoadingText && (
        <Text
          id="loading-text"
          size="1xl"
          as="kbd"
          color="#F0F1E7"
          whiteSpace="pre-line"
          className="text-animate-blink"
          textAlign="center"
        >
          {
            "Then, sit tight. We're crunching the numbers! \n\n Matching your energy profile against air-conditioners out there \n to find the right ones for you..."
          }
        </Text>
      )}
      {!showLoadingText && <EducationTidbit />}
      {!showLoadingText && (
        <Box mt={10} mr="0" ml="auto" pr={10}>
          <Link href="/profile">
            <Button
              type="button"
              rightIcon={<BiSolidRightArrow />}
              size="lg"
              variant="solid"
              backgroundColor="#F0F1E7"
              color="#253610"
              colorScheme="whiteAlpha"
              borderRadius={20}
              paddingRight={4}
              sx={{ fontSize: '20px' }}
            >
              See my personalised results
            </Button>
          </Link>
        </Box>
      )}
    </VStack>
  )
}
