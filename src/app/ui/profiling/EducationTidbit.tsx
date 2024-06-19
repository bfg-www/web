import { useEffect, useState } from 'react'
import { EDUCATIONAL_TIPS } from '../models/profile-options'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { HiLightBulb } from 'react-icons/hi'

export default function EducationTidbit() {
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
