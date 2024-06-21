import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { RiHeartAdd2Fill } from 'react-icons/ri'

export const HeartIconAdd = () => {
  const toast = useToast()
  const [liked, setLiked] = useState(false)

  const message = liked ? 'Removed from favourites' : 'Added to favourites!'

  const handleClick = () => {
    setLiked(!liked)
    toast({
      title: message,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <RiHeartAdd2Fill
      size="35px"
      fill={liked ? '#68D391' : 'black'}
      stroke={liked ? '#68D391' : 'black'}
      cursor="pointer"
      onClick={handleClick}
    ></RiHeartAdd2Fill>
  )
}

export default HeartIconAdd
