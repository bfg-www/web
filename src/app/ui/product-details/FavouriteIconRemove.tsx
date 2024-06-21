import { AirconWithDetail } from '@/app/models/clientModels'
import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { FaHeartCircleMinus } from 'react-icons/fa6'
import { updateFavouritesInLocalStorage } from '../helpers'

export const HeartIconRemove = ({ product }: { product: AirconWithDetail }) => {
  const toast = useToast()
  const [removed, setLiked] = useState(false)

  const handleClick = () => {
    setLiked(!removed)
    updateFavouritesInLocalStorage(product)
    toast({
      title: 'Removed from favourites',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <FaHeartCircleMinus
      size="25px"
      fill={removed ? 'black' : '#68D391'}
      stroke={removed ? 'black' : '#68D391'}
      cursor="pointer"
      onClick={handleClick}
    ></FaHeartCircleMinus>
  )
}

export default HeartIconRemove
