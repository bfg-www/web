

import { Box, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { RiHeartAdd2Fill } from "react-icons/ri";


export const HeartIcon = () => {
  const toast = useToast()
  const [liked, setLiked] = useState(false);

  const message = liked ? 'Removed from favourites' : 'Added to favourites!';

  const handleClick = () => {
    setLiked(!liked);
    toast({
        title: message,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
   } )
  };

  return (
    <RiHeartAdd2Fill
      size="30px"
      viewBox="0 0 24 24"
      fill={liked ? '#4F772D' : 'black'}
      stroke={liked ? '#4F772D' : 'black'}
      cursor="pointer"
      onClick={handleClick}
    >
    </RiHeartAdd2Fill>
  );
};

export default HeartIcon;
