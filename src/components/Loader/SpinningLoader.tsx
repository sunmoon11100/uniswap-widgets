import styled, { keyframes } from 'styled-components'
import { mediaWidth } from 'theme'

const StyledPollingDot = styled.div`
  background-color: ${({ theme }) => theme.module};
  border-radius: 50%;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  position: relative;
  transition: 250ms ease background-color;
  width: 8px;
`

const StyledPolling = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.primary};
  display: flex;
  height: 16px;
  margin-left: 2px;
  margin-right: 2px;
  transition: 250ms ease color;
  width: 16px;
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
  background: transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  border-right: 1px solid transparent;
  border-top: 1px solid transparent;
  height: 14px;
  left: -3px;
  position: relative;
  top: -3px;
  transform: translateZ(0);
  transition: 250ms ease border-color;
  width: 14px;
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
