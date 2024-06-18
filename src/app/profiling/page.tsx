'use client'

import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  FormControl,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BiSolidRightArrow } from 'react-icons/bi'
import { HiLightBulb } from 'react-icons/hi'
import {
  EDUCATIONAL_TIPS,
  HOUSEHOLD_TYPE_OPTIONS,
  INSTALLATION_LOCATION_OPTIONS,
} from '../ui/models/profile-options'

interface FormValues {
  householdType: string
  airconCount: string
  installationLocation: string
  usageHours: string
}

{
  /* Page manages the state for form submission, mock loading, and education tidbit visibility. 
    - formSubmitted is false -> whether form component renders or is hidden depend when 'Next' is clicked
    - formSubmitted is true, isMockLoading set to true, set timeout for 3 seconds -> loading component (controlled by FE since loading is independent of BE's computation of the inputs)
    - education tidbit state (component controlled by FE, "Show me my results!" btn to trigger next route/page)
    */
}
export default function Page() {
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
  const [isMockLoading, setIsMockLoading] = useState<boolean>(false)
  const [mockProgressStat, setMockProgressStat] = useState<number>(0)

  const handleFormSubmit = (data: FormValues) => {
    // ************* JX TODO: call getDummyAircon(data) ************* //
    console.log('handleSubmit called')
    console.log('data:', data)
    console.log('set state transitions')
    setIsFormSubmitted(true)
    setIsMockLoading(true)
    setMockProgressStat(0)

    const interval = setInterval(() => {
      setMockProgressStat((prev) => {
        if (prev >= 99) {
          clearInterval(interval)
          setIsMockLoading(false)
        }
        return prev + 1
      })
    }, 60) // 60ms * 100 = 6000ms (6 sec)
  }

  return (
    <>
      {!isFormSubmitted && <EnergyProfileForm onSubmit={handleFormSubmit} />}
      {isFormSubmitted && (
        <FullscreenSpinner
          progress={mockProgressStat}
          showLoadingText={isMockLoading}
        />
      )}
    </>
  )
}

function FullscreenSpinner({
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

function EducationTidbit() {
  // See https://stackoverflow.com/questions/72673362/error-text-content-does-not-match-server-rendered-html
  const [hydrated, setHydrated] = useState<boolean>(false)
  useEffect(() => {
    setHydrated(true)
  }, [])
  if (!hydrated) {
    // Returns null on first render, so client and server matches
    return null
  }
  const getRandomIndexFromCollection = (
    items: Array<{ question: string; answer: string }>,
  ) => {
    return Math.floor(Math.random() * items.length)
  }
  const selectedIndex = getRandomIndexFromCollection(EDUCATIONAL_TIPS)
  console.log('selectedIndex:', selectedIndex)

  return (
    <VStack width="50%" alignItems="center">
      <HStack justifyContent="center">
        <HiLightBulb color="#F0F1E7" size="30px" />
        <Text size="1xl" as="kbd" color="#F0F1E7">
          {EDUCATIONAL_TIPS[selectedIndex].question}
        </Text>
      </HStack>
      <Text fontSize="1xl" as="kbd" color="#F0F1E7" align="center">
        {EDUCATIONAL_TIPS[selectedIndex].answer}
      </Text>
    </VStack>
  )
}

function EnergyProfileForm({
  onSubmit,
}: {
  onSubmit: (data: FormValues) => void
}) {
  const [householdType, setHouseholdType] = useState<string>('four_room')
  const [airconCount, setAirconCount] = useState<string>('1')
  const [installationLocation, setInstallationLocation] =
    useState<string>('living_room')
  const [usageHours, setUsageHours] = useState<string>('8')

  return (
    <VStack width="100%" height="100%" justifyContent="center" spacing="100px">
      <Flex>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit({
              householdType,
              airconCount,
              installationLocation,
              usageHours,
            })
          }}
          id="energy-profile-form"
        >
          <VStack alignItems="flex-start">
            <Text
              fontSize="1xl"
              mb={4}
              alignItems="center"
              color="#F0F1E7"
              as="kbd"
            >
              First, let's get your energy profile.
            </Text>
            <HStack mb={1}>
              <Text fontSize="4xl" mb={4} alignItems="center" color="#F0F1E7">
                I live in a
              </Text>
              <FormControl display="inline-block" w="auto" mx={2}>
                <Select
                  value={householdType}
                  bg="#253610"
                  color="#F0F1E7"
                  borderColor="#F0F1E7"
                  variant="flushed"
                  size="lg"
                  sx={{ fontSize: '35px', textAlign: 'center', mb: '15px' }}
                  onChange={(e) => setHouseholdType(e.target.value)}
                >
                  {HOUSEHOLD_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Text fontSize="4xl" mb={4} alignItems="center" color="#F0F1E7">
                , and I am looking for
              </Text>
              <FormControl display="inline-block" w="auto" mx={2}>
                <NumberInput
                  min={1}
                  max={10}
                  value={airconCount}
                  onChange={(valueString) => setAirconCount(valueString)}
                  bg="#253610"
                  color="#F0F1E7"
                  borderColor="#F0F1E7"
                  variant="flushed"
                  size="lg"
                  maxW={32}
                >
                  <NumberInputField
                    sx={{ fontSize: '35px', textAlign: 'center', mb: '15px' }}
                  />
                </NumberInput>
              </FormControl>
              <Text fontSize="4xl" mb={4} alignItems="center" color="#F0F1E7">
                air-con(s)
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="4xl" mb={4} alignItems="center" color="#F0F1E7">
                for my
              </Text>
              <FormControl display="inline-block" w="auto" mx={2}>
                <Select
                  value={installationLocation}
                  bg="#253610"
                  color="#F0F1E7"
                  borderColor="#F0F1E7"
                  variant="flushed"
                  size="lg"
                  sx={{ fontSize: '35px', textAlign: 'center', mb: '15px' }}
                  onChange={(e) => setInstallationLocation(e.target.value)}
                >
                  {INSTALLATION_LOCATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Text fontSize="4xl" mb={4} alignItems="center" color="#F0F1E7">
                .
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="4xl" mb={4} alignItems="center" color="#F0F1E7">
                My household uses the air-con for about
              </Text>
              <FormControl display="inline-block" w="auto" mx={2}>
                <NumberInput
                  min={1}
                  max={24}
                  value={usageHours}
                  onChange={(valueString) => setUsageHours(valueString)}
                  bg="#253610"
                  color="#F0F1E7"
                  borderColor="#F0F1E7"
                  variant="flushed"
                  size="lg"
                  maxW={32}
                >
                  <NumberInputField
                    sx={{ fontSize: '35px', textAlign: 'center', mb: '15px' }}
                  />
                </NumberInput>
              </FormControl>
              <Text fontSize="4xl" mb={4} alignItems="center" color="#F0F1E7">
                hours a day.
              </Text>
            </HStack>
          </VStack>
        </form>
      </Flex>
      <Box mt={10} mr="0" ml="auto" pr={10}>
        <Button
          type="submit"
          form="energy-profile-form"
          rightIcon={<BiSolidRightArrow />}
          size="lg"
          variant="solid"
          backgroundColor="#F0F1E7"
          color="#253610"
          colorScheme="whiteAlpha"
          borderRadius={20}
          paddingRight={4}
          sx={{ fontSize: '30px' }}
        >
          Next
        </Button>
      </Box>
    </VStack>
  )
}
