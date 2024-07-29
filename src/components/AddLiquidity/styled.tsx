import { AutoColumn } from 'components/Column'
import { Input } from 'components/NumericalInput'
import styled from 'styled-components'
import { mediaWidth } from 'theme'
import { SCREEN_BREAKPOINTS, WIDGET_BREAKPOINTS } from 'theme/breakpoints'

export const Wrapper = styled.div`
  position: relative;
  padding: 26px 16px;
`

export const ScrollablePage = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  ${({ theme }) => mediaWidth.deprecated_upToMedium`
    margin: 0 auto;
  `};

  @media only screen and (max-width: ${({ theme }) => `${WIDGET_BREAKPOINTS.MEDIUM}px`}) {
    padding: 48px 8px 0px;
  }

  @media only screen and (max-width: ${({ theme }) => `${WIDGET_BREAKPOINTS.SMALL}px`}) {
    padding-top: 20px;
  }
`

export const DynamicSection = styled(AutoColumn)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? '0.2' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'initial')};
`

export const StyledInput = styled(Input)`
  background-color: ${({ theme }) => theme.container};
  text-align: left;
  font-size: 18px;
  width: 100%;
`

/* two-column layout where DepositAmount is moved at the very end on mobile. */
export const ResponsiveTwoColumns = styled.div<{ wide: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;

  border-top: 1px solid ${({ theme }) => theme.container};

  ${({ theme }) => mediaWidth.deprecated_upToMedium`
    margin-top: 0;
  `};
`

export const MediumOnly = styled.div`
  ${({ theme }) => mediaWidth.deprecated_upToMedium`
    display: none;
  `};
`
