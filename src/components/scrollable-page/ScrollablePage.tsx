import styled from 'styled-components'
import { mediaWidth } from 'theme'
import { WIDGET_BREAKPOINTS } from 'theme/breakpoints'

export const ScrollablePage = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px 8px 0px;
  position: relative;

  ${({}) => mediaWidth.deprecated_upToMedium`
    margin: 0 auto;
  `};

  @media only screen and (max-width: ${({ theme }) => `${WIDGET_BREAKPOINTS.MEDIUM}px`}) {
    padding: 48px 8px 0px;
  }

  @media only screen and (max-width: ${({ theme }) => `${WIDGET_BREAKPOINTS.SMALL}px`}) {
    padding-top: 20px;
  }
`
