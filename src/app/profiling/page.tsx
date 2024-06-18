'use client'

import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import { BiSolidRightArrow } from 'react-icons/bi'

export const HOUSEHOLD_TYPE_OPTIONS = [
  { label: '1-Room', value: 'one_room' },
  { label: '2-Room', value: 'two_room' },
  { label: '3-Room', value: 'three_room' },
  { label: '4-Room', value: 'four_room' },
  { label: '5-Room', value: 'five_room' },
  { label: 'Jumbo/Executive', value: 'jumbo' },
]

export const INSTALLATION_LOCATION_OPTIONS = [
  { label: 'entire house', value: 'entire_house' },
  { label: 'bedroom(s)', value: 'bedroom' },
  { label: 'living room', value: 'living_room' },
  { label: 'kitchen', value: 'kitchen' },
]

{
  /* Page to handle 
    - formSubmitted is false -> whether form component renders or is hidden depend when 'Next' is clicked
    - formSubmitted is true, isMockLoading set to true, set timeout for 3 seconds -> loading component (controlled by FE since loading is independent of BE's computation of the inputs)
    - education tidbit state (component controlled by FE, "Show me my results!" btn to trigger next route/page)
    */
}
export default function Page() {
  const [isFormSubmitted, setIsFormSubmitted] = useState<Boolean>(false)
  const [isMockLoading, setIsMockLoading] = useState<Boolean>(false)

  return (
    <>
      {!isFormSubmitted && <EnergyProfileForm />}
      {isFormSubmitted && <FullscreenSpinner />}
    </>
  )
}

function FullscreenSpinner() {}

function EnergyProfileForm() {
  const [householdType, setHouseholdType] = useState<string>('four_room')
  const [airconCount, setAirconCount] = useState<string>('1')
  const [installationLocation, setInstallationLocation] =
    useState<string>('living_room')
  const [usageHours, setUsageHours] = useState<string>('8')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    // handle form submission to BE
    console.log('handleSubmit called', {
      householdType,
      airconCount,
      installationLocation,
      usageHours,
    })
  }

  return (
    <VStack
      width="100%"
      height="100%"
      borderWidth="1px"
      justifyContent="center"
      spacing="100px"
    >
      <Flex borderWidth="2px">
        <form onSubmit={() => {}} id="energy-profile-form">
          <VStack alignItems="flex-start">
            <Text
              fontSize="1xl"
              mb={4}
              alignItems="center"
              color="#F0F1E7"
              as="kbd"
            >
              First, let's size your needs.
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
          onClick={handleSubmit}
          form="edit-task-form"
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
