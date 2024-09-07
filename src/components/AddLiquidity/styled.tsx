import { AutoColumn } from 'components/Column'
import { Input } from 'components/NumericalInput'
import styled from 'styled-components'
import { mediaWidth } from 'theme'
import { WIDGET_BREAKPOINTS } from 'theme/breakpoints'

export const Wrapper = styled.div`
  padding: 26px 16px;
  position: relative;
`

export const ScrollablePage = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

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
  font-size: 18px;
  text-align: left;
  width: 100%;
`

/* two-column layout where DepositAmount is moved at the very end on mobile. */
export const ResponsiveTwoColumns = styled.div<{ wide: boolean }>`
  border-top: 1px solid ${({ theme }) => theme.container};
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding-top: 20px;

  ${({ theme }) => mediaWidth.deprecated_upToMedium`
    margin-top: 0;
  `};
`

export const MediumOnly = styled.div`
  ${({ theme }) => mediaWidth.deprecated_upToMedium`
    display: none;
  `};
`
