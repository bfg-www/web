import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import {
  HOUSEHOLD_TYPE_OPTIONS,
  INSTALLATION_LOCATION_OPTIONS,
} from '../models/profile-options'
import { BiSolidRightArrow } from 'react-icons/bi'
import { ProfileFormValues } from '@/app/models/clientModels'

export default function EnergyProfileForm({
  onSubmit,
}: {
  onSubmit: (data: ProfileFormValues) => void
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
