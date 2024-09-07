import styled from 'styled-components'

export const ToggleWrapper = styled.button<{ width?: string }>`
  align-items: center;
  background: ${({ theme }) => theme.container};
  border: ${({ theme }) => '1px solid ' + theme.outline};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  outline: none;
  padding: 1px;
  width: ${({ width }) => width ?? '100%'};
`

export const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  align-items: center;
  background: ${({ theme, isActive }) => (isActive ? theme.module : 'none')};
  border-radius: 6px;
  color: ${({ theme, isActive }) => (isActive ? theme.primary : theme.accentSoft)};
  display: flex;
  font-size: ${({ fontSize }) => fontSize ?? '1rem'};
  font-weight: 535;
  height: 100%;
  justify-content: center;
  padding: 4px 0.5rem;
  white-space: nowrap;
  width: 100%;
  :hover {
    color: ${({ theme, isActive }) => (isActive ? theme.active : theme.accentSoft)};
    user-select: initial;
  }
`
