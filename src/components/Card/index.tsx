import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

const Card = styled(Box)<{ width?: string; padding?: string; border?: string; $borderRadius?: string }>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1rem'};
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '16px'};
  border: ${({ border }) => border};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid #ffffff12;
  background-color: #1b1b1b;
`

export const GrayCard = styled(Card)`
  background-color: #1b1b1b;
`

export const DarkGrayCard = styled(Card)`
  background-color: #ffffff12;
`

export const DarkCard = styled(Card)`
  background-color: #131313;
  border: 1px solid #ffffff12;
`

export const OutlineCard = styled(Card)`
  border: 1px solid #ffffff12;
  background-color: #1b1b1b;
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: #5d4204;
  font-weight: 535;
`

export const BlueCard = styled(Card)`
  background-color: #311c31;
  color: #fc72ff;
  border-radius: 12px;
`
