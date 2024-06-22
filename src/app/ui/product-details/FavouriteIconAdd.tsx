'use client'

import { AirconWithDetail } from '@/app/models/clientModels'
import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { RiHeartAdd2Fill } from 'react-icons/ri'
import { updateFavouritesInLocalStorage } from '../helpers'

export const HeartIconAdd = ({ product }: { product: AirconWithDetail }) => {
  const toast = useToast()
  const [liked, setLiked] = useState(false)

  const message = liked ? 'Removed from favourites' : 'Added to favourites!'

  const handleClick = () => {
    setLiked(!liked)
    updateFavouritesInLocalStorage(product)
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
