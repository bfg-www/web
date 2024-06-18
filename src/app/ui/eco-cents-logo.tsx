import { HStack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import ecocentsLogo from '/public/ecocents-icon-landing.png'

interface EcoCentsLogoProps {
  textColor?: string
  width?: number
  height?: number
}

export default function EcoCentsLogo({
  textColor = '#253610',
  width = 40,
  height = 50,
}: EcoCentsLogoProps) {
  return (
    <HStack gap={0}>
      <Image
        src={ecocentsLogo}
        alt="Logo of web platform"
        width={width}
        height={height}
      />
      <Text fontSize="2xl" color={textColor} as="b">
        Ecocents
      </Text>
    </HStack>
  )
}
