import { ProfileFormValues } from '@/app/models/clientModels'
import { useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  HOUSEHOLD_TYPE_OPTIONS,
  INSTALLATION_LOCATION_OPTIONS,
} from '../models/profile-options'
import { IoIosRefresh } from 'react-icons/io'

export default function EnergyProfileFormWidget({
  onSubmit,
  isFetching,
  isEditable,
}: {
  onSubmit: (data: ProfileFormValues) => void
  isFetching?: boolean
  isEditable: boolean
}) {
  const [householdType, setHouseholdType] = useState<string>('')
  const [airconCount, setAirconCount] = useState<string>('')
  const [installationLocation, setInstallationLocation] = useState<string>('')
  const [usageHours, setUsageHours] = useState<string>('')

  useEffect(() => {
    const userEnergyProfile = JSON.parse(
      localStorage.getItem('userEnergyProfile') || '{}',
    )
    setHouseholdType(userEnergyProfile.householdType || '')
    setAirconCount(userEnergyProfile.airconCount || '')
    setInstallationLocation(userEnergyProfile.installationLocation || '')
    setUsageHours(userEnergyProfile.usageHours || '')
  }, []) // Empty dependency array ensures this effect runs once after the initial render

  return (
    <VStack
      backgroundColor="rgba(37, 54, 16)"
      borderRadius="20px"
      p={3}
      boxShadow="lg"
    >
      <Text fontSize="xs" alignSelf="flex-start" color="#F0F1E7" as="kbd">
        Based on your energy profile:
      </Text>
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
        id="energy-profile-form-widget"
      >
        <HStack spacing={5}>
          <FormControl display="inline-block" w="auto">
            <Select
              isDisabled={!isEditable || isFetching}
              value={householdType}
              color="#F0F1E7"
              borderColor="#F0F1E7"
              variant="flushed"
              size="xs"
              sx={{ fontSize: '15px', textAlign: 'center' }}
              onChange={(e) => setHouseholdType(e.target.value)}
            >
              {HOUSEHOLD_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl display="inline-block" w="auto">
            <HStack>
              <NumberInput
                isDisabled={!isEditable || isFetching}
                min={1}
                max={10}
                value={airconCount}
                onChange={(valueString) => setAirconCount(valueString)}
                color="#F0F1E7"
                borderColor="#F0F1E7"
                variant="flushed"
                size="xs"
                maxW={14}
              >
                <NumberInputField sx={{ fontSize: '15px' }} />
              </NumberInput>
              <Text fontSize="15px" mt={1} alignItems="center" color="#F0F1E7">
                air-con(s)
              </Text>
            </HStack>
          </FormControl>
          <FormControl display="inline-block" w="auto">
            <Select
              isDisabled={!isEditable || isFetching}
              value={installationLocation}
              color="#F0F1E7"
              borderColor="#F0F1E7"
              variant="flushed"
              size="xs"
              sx={{ fontSize: '15px', textAlign: 'center' }}
              onChange={(e) => setInstallationLocation(e.target.value)}
            >
              {INSTALLATION_LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl display="inline-block" w="auto">
            <HStack>
              <NumberInput
                isDisabled={!isEditable || isFetching}
                min={1}
                max={24}
                value={usageHours}
                onChange={(valueString) => setUsageHours(valueString)}
                color="#F0F1E7"
                borderColor="#F0F1E7"
                variant="flushed"
                size="xs"
                maxW={14}
              >
                <NumberInputField
                  sx={{ fontSize: '15px', textAlign: 'center' }}
                />
              </NumberInput>
              <Text fontSize="15px" mt={1} alignItems="center" color="#F0F1E7">
                hour(s) a day
              </Text>
            </HStack>
          </FormControl>
          <Button
            isDisabled={!isEditable || isFetching}
            type="submit"
            form="energy-profile-form-widget"
            size="xs"
            variant="solid"
            backgroundColor="#F0F1E7"
            color="#253610"
            colorScheme="whiteAlpha"
            borderRadius="10px"
            alignSelf="flex-end"
            iconSpacing={1}
            rightIcon={
              isFetching ? (
                <Spinner size="xs" color="#F0F1E7" />
              ) : (
                <IoIosRefresh />
              )
            }
            boxShadow="base"
          >
            Update
          </Button>
        </HStack>
      </form>
    </VStack>
  )
}
