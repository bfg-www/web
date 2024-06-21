import { Skeleton, Stack } from '@chakra-ui/react'

export default function SkeletonPlaceholder() {
  return (
    <Stack height="100%" width="100%" spacing={5}>
      <Skeleton
        startColor="#F0F1E7"
        endColor="white"
        height="250px"
        borderRadius="15px"
      />
      <Skeleton startColor="#F0F1E7" endColor="white" height="250px" />
      <Skeleton startColor="#F0F1E7" endColor="white" height="250px" />
      <Skeleton startColor="#F0F1E7" endColor="white" height="250px" />
      <Skeleton startColor="#F0F1E7" endColor="white" height="250px" />
    </Stack>
  )
}
