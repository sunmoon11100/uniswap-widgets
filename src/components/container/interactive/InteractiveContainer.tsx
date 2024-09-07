import styled from 'styled-components'
import { Color } from 'theme'

export const InteractiveContainer = styled.div`
  background-color: ${({ theme }) => theme.interactive};
`

export const InteractiveContainerRounded = styled(InteractiveContainer)<{
  border?: boolean
  fullWidth?: boolean
  padding?: string
  borderColor?: Color
}>`
  border: ${({ theme, border, borderColor }) =>
    border ? `solid 1px ${theme[borderColor ? borderColor : 'outline']}` : 'None'};
  border-radius: ${({ theme }) => theme.borderRadius.medium}rem;
  padding: ${({ padding }) => (padding ? padding : '8px')};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'inherit')};
`
