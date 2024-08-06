import styled, { keyframes } from 'styled-components'
import { mediaWidth } from 'theme'

const StyledPollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme }) => theme.module};
  transition: 250ms ease background-color;
`

const StyledPolling = styled.div`
  display: flex;
  height: 16px;
  width: 16px;
  margin-right: 2px;
  margin-left: 2px;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  transition: 250ms ease color;
  ${({ theme }) => mediaWidth.deprecated_upToMedium`
    display: none;
  `}
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.primary};
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;
  transition: 250ms ease border-color;
  left: -3px;
  top: -3px;
`

export default function SpinningLoader() {
  return (
    <StyledPolling>
      <StyledPollingDot>
        <Spinner />
      </StyledPollingDot>
    </StyledPolling>
  )
}
