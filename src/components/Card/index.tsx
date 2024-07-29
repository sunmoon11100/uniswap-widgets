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
  border: 1px solid ${({ theme }) => theme.outline};
  background-color: ${({ theme }) => theme.container};
`

export const GrayCard = styled(Card)`
  background-color: ${({ theme }) => theme.container};
`

export const DarkGrayCard = styled(Card)`
  background-color: ${({ theme }) => theme.outline};
`

export const DarkCard = styled(Card)`
  background-color: ${({ theme }) => theme.module};
  border: 1px solid ${({ theme }) => theme.outline};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.outline};
  background-color: ${({ theme }) => theme.container};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.warning};
  font-weight: 535;
`

export const BlueCard = styled(Card)`
  background-color: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accent};
  border-radius: 12px;
`
