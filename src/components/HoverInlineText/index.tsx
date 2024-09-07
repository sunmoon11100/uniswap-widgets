import { TooltipText } from 'components/Tooltip'
import { useState } from 'react'
import styled from 'styled-components'

const TextWrapper = styled.span<{
  margin: boolean
  link?: boolean
  fontSize?: string
  adjustSize?: boolean
  textColor?: string
}>`
  font-size: ${({ fontSize }) => fontSize ?? 'inherit'};
  margin-left: ${({ margin }) => (margin ? '4px' : 'none')};

  @media screen and (max-width: 600px) {
    font-size: ${({ adjustSize }) => (adjustSize ? '12px' : 'none')};
  }
`

function HoverInlineText({
  text,
  maxCharacters = 20,
  margin = false,
  adjustSize = false,
  fontSize,
  textColor,
  link,
  ...rest
}: {
  text?: string
  maxCharacters?: number
  margin?: boolean
  adjustSize?: boolean
  fontSize?: string
  textColor?: string
  link?: boolean
}) {
  const [showHover, setShowHover] = useState(false)

  if (!text) {
    return <span />
  }

  if (text.length > maxCharacters) {
    return (
      <TooltipText
        text={
          <TextWrapper
            onMouseEnter={() => setShowHover(true)}
            onMouseLeave={() => setShowHover(false)}
            margin={margin}
            adjustSize={adjustSize}
            textColor={textColor}
            link={link}
            fontSize={fontSize}
            {...rest}
          >
            {' ' + text.slice(0, maxCharacters - 1) + '...'}
          </TextWrapper>
        }
      >
        {text}
      </TooltipText>
    )
  }

  return (
    <TextWrapper
      margin={margin}
      adjustSize={adjustSize}
      link={link}
      fontSize={fontSize}
      textColor={textColor}
      {...rest}
    >
      {text}
    </TextWrapper>
  )
}

export default HoverInlineText
