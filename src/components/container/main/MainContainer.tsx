import { rgba } from 'polished'
import styled from 'styled-components'

export const MainContainer = styled.div`
  background-color: ${({ theme }) => rgba(theme.container, 0.1)};
  border: ${({ theme }) => `1px solid ${theme.outline}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium}rem;
`
