import { Tooltip } from '@chakra-ui/react'
import { LiaQuestionCircle } from 'react-icons/lia'
import { FiInfo } from 'react-icons/fi'

export default function CustomTooltip({
  content,
  color = '#F0F1E7',
  iconType = 'question',
}: {
  content: string
  color?: string
  iconType?: string
}) {
  return (
    <Tooltip hasArrow label={content} placement="bottom" color="#F0F1E7">
      <span>
        {iconType === 'question' ? (
          <LiaQuestionCircle color={color} />
        ) : (
          <FiInfo color={color} />
        )}
      </span>
    </Tooltip>
  )
}
