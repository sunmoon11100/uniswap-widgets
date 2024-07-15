import styled from 'styled-components'

export const InteractiveContainer = styled.div`
  background-color: ${({ theme }) => theme.interactive};
`

export const InteractiveContainerRounded = styled(InteractiveContainer)`
  border-radius: ${({ theme }) => theme.borderRadius.medium}rem;
`
