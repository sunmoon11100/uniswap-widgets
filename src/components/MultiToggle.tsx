import styled from 'styled-components'

export const ToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? '100%'};
  padding: 1px;
  background: ${({ theme }) => theme.container};
  border-radius: 8px;
  border: ${({ theme }) => '1px solid ' + theme.outline};
  cursor: pointer;
  outline: none;
`

export const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0.5rem;
  border-radius: 6px;
  justify-content: center;
  height: 100%;
  background: ${({ theme, isActive }) => (isActive ? theme.module : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.primary : theme.accentSoft)};
  font-size: ${({ fontSize }) => fontSize ?? '1rem'};
  font-weight: 535;
  white-space: nowrap;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) => (isActive ? theme.active : theme.accentSoft)};
  }
`
