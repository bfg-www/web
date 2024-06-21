import { SORTING_OPTIONS } from '@/app/profile/page'
import { Select } from '@chakra-ui/react'

export default function SortByDropdown({
  sortBy,
  onChange,
}: {
  sortBy: string
  onChange: (sortBy: string) => void
}) {
  return (
    <Select
      w="230px"
      placeholder="Sort by"
      value={sortBy}
      bg="#F0F1E7"
      color="#4F772D"
      borderRadius="20px"
      focusBorderColor="#4F772D"
      variant="flushed"
      boxShadow="base"
      sx={{ textAlign: 'center' }}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    >
      {SORTING_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
