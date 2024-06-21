import { Aircon } from '@/app/models/clientModels'
import {
  Button,
  Checkbox,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LuDollarSign } from 'react-icons/lu'
import { PiMoneyWavyFill } from 'react-icons/pi'
import { TbAirConditioning, TbChecks } from 'react-icons/tb'
import { capitalizeFirstLetter, getAirconBrands } from '../helpers'

export interface Filter {
  greenTicks: number
  isClimateVoucherEligibleOnly: boolean
  maxPrice: string
  brand: string
}

export const ENERGY_RATING_OPTIONS = [
  { label: <>&#10004;</>, value: 1 },
  { label: <>&#10004; &#10004;</>, value: 2 },
  { label: <>&#10004; &#10004; &#10004;</>, value: 3 },
  { label: <>&#10004; &#10004; &#10004; &#10004;</>, value: 4 },
  { label: <>&#10004; &#10004; &#10004; &#10004; &#10004;</>, value: 5 },
]

export const INITIAL_FILTERS = {
  greenTicks: 0,
  isClimateVoucherEligibleOnly: false,
  maxPrice: '',
  brand: '',
}

export default function FilterPanel({
  results,
  onSubmit,
  isUpdating,
}: {
  results: Aircon[]
  onSubmit: (data: Filter) => void
  isUpdating: boolean
}) {
  const [filters, setFilters] = useState<Filter>(INITIAL_FILTERS)

  const handleParamChange = (
    param: keyof Filter,
    value: string | number | boolean,
  ) => {
    setFilters({ ...filters, [param]: value })
  }

  const handleReset = () => {
    setFilters(INITIAL_FILTERS)
  }

  return (
    <VStack spacing={10} pt={5} alignItems="center">
      <VStack alignItems="center">
        <HStack>
          <TbChecks color="#4F772D" size="25px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Energy Tick Ratings
          </Text>
        </HStack>
        <Select
          w="250px"
          placeholder="Select ticks"
          value={filters.greenTicks}
          bg="#F0F1E7"
          color="#4F772D"
          borderRadius="20px"
          focusBorderColor="#4F772D"
          variant="flushed"
          boxShadow="sm"
          sx={{ textAlign: 'center' }}
          onChange={(e) =>
            handleParamChange('greenTicks', Number(e.target.value))
          }
        >
          {ENERGY_RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </VStack>
      <VStack>
        <HStack>
          <PiMoneyWavyFill color="#4F772D" size="25px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Climate Voucher Eligibility
          </Text>
        </HStack>
        <HStack width="70%">
          <Checkbox
            boxShadow="sm"
            colorScheme="green"
            size="md"
            isChecked={filters.isClimateVoucherEligibleOnly}
            onChange={(e) =>
              handleParamChange(
                'isClimateVoucherEligibleOnly',
                e.target.checked,
              )
            }
          />
          <Text fontSize="sm" color="#4F772D">
            Only show appliances that are eligible for climate vouchers
          </Text>
        </HStack>
      </VStack>
      <VStack>
        <HStack spacing={1}>
          <LuDollarSign color="#4F772D" size="20px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Price
          </Text>
        </HStack>
        <HStack p="0px 40px">
          <NumberInput
            value={filters.maxPrice}
            min={0}
            size="md"
            width="150px"
            color="#4F772D"
            focusBorderColor="#4F772D"
            onChange={(stringValue) =>
              handleParamChange('maxPrice', stringValue)
            }
          >
            <NumberInputField
              bg="#F0F1E7"
              placeholder="Max. price"
              borderRadius="20px"
              boxShadow="sm"
            />
          </NumberInput>
        </HStack>
      </VStack>
      <VStack alignItems="center">
        <HStack>
          <TbAirConditioning color="#4F772D" size="22px" />
          <Text fontSize="md" color="#4F772D" as="b">
            Brands
          </Text>
        </HStack>
        <Select
          w="250px"
          placeholder="Select a brand"
          value={filters.brand}
          bg="#F0F1E7"
          color="#4F772D"
          borderRadius="20px"
          focusBorderColor="#4F772D"
          variant="flushed"
          boxShadow="sm"
          sx={{ textAlign: 'center' }}
          onChange={(e) => handleParamChange('brand', e.target.value)}
        >
          {getAirconBrands(results).map((option, index) => (
            <option key={index} value={option}>
              {capitalizeFirstLetter(option)}
            </option>
          ))}
        </Select>
      </VStack>
      <HStack mt="50px" spacing={15}>
        <Button
          variant="solid"
          backgroundColor="white"
          border="1px"
          borderColor="#253610"
          borderRadius="20px"
          onClick={handleReset}
          boxShadow="base"
          isDisabled={isUpdating}
        >
          Clear
        </Button>
        <Button
          variant="solid"
          backgroundColor="#4F772D"
          color="#F0F1E7"
          colorScheme="green"
          borderRadius="20px"
          width="150px"
          onClick={() => onSubmit(filters)}
          boxShadow="base"
          isDisabled={isUpdating}
          rightIcon={isUpdating ? <Spinner size="xs" color="#F0F1E7" /> : <></>}
        >
          Apply
        </Button>
      </HStack>
    </VStack>
  )
}
