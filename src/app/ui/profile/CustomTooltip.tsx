import { Tooltip } from '@chakra-ui/react'
import { LiaQuestionCircle } from 'react-icons/lia'

export default function CustomTooltip({
  content,
  color = '#F0F1E7',
}: {
  content: string
  color?: string
}) {
  return (
    <Tooltip hasArrow label={content} placement="bottom" color="#F0F1E7">
      <span>
        <LiaQuestionCircle color={color} />
      </span>
    </Tooltip>
  )
}
