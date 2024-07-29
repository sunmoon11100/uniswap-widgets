import { Text } from 'rebass'
import styled from 'styled-components'
import { mediaWidth } from 'theme'

export const Wrapper = styled.div`
  position: relative;
  padding: 20px;
  min-width: 460px;

  ${({ theme }) => mediaWidth.deprecated_upToExtraSmall`
    min-width: 340px;
  `};
`

export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.accentSoft};
  border: 1px solid ${({ theme }) => theme.accentSoft};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => mediaWidth.deprecated_upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-weight: 535;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.accent};
  :hover {
    border: 1px solid ${({ theme }) => theme.accent};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.accent};
    outline: none;
  }
`

export const SmallMaxButton = styled(MaxButton)`
  font-size: 12px;
`

export const ResponsiveHeaderText = styled(Text)`
  font-size: 40px;
  font-weight: 535;
  ${({ theme }) => mediaWidth.deprecated_upToExtraSmall`
     font-size: 24px
  `};
`
