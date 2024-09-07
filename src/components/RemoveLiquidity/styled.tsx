import { Text } from 'rebass'
import styled from 'styled-components'
import { mediaWidth } from 'theme'

export const Wrapper = styled.div`
  min-width: 460px;
  padding: 20px;
  position: relative;

  ${({ theme }) => mediaWidth.deprecated_upToExtraSmall`
    min-width: 340px;
  `};
`

export const MaxButton = styled.button<{ width: string }>`
  background-color: ${({ theme }) => theme.accentSoft};
  border: 1px solid ${({ theme }) => theme.accentSoft};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.accent};
  cursor: pointer;
  ${({ theme }) => mediaWidth.deprecated_upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-size: 1rem;
  font-weight: 535;
  margin: 0.25rem;
  overflow: hidden;
  padding: 0.5rem 1rem;
  :hover {
    border: 1px solid ${({ theme }) => theme.accent};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.accent};
    outline: none;
  }
`

export const SmallMaxButton = styled(MaxButton)`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
`

export const ResponsiveHeaderText = styled(Text)`
  font-size: 40px;
  font-weight: 535;
  ${({ theme }) => mediaWidth.deprecated_upToExtraSmall`
     font-size: 24px
  `};
`
