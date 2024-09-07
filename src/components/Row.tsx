import { Children, ReactNode } from 'react'
import styled from 'styled-components/macro'
import { Color, Gap, Theme } from 'theme'

export interface RowProps {
  color?: Color
  align?: string
  justify?: string
  justifyContent?: string
  flow?: string
  pad?: number
  gap?: number | Gap | string
  flex?: true
  grow?: true | 'first' | 'last'
  children?: ReactNode
  theme: Theme
  paddingBottom?: string
}

const Row = styled.div<RowProps>`
  align-items: ${({ align }) => align ?? 'center'};
  color: ${({ color, theme }) => color && theme[color]};
  display: ${({ flex }) => (flex ? 'flex' : 'grid')};
  flex-flow: ${({ flow }) => flow ?? 'wrap'};
  flex-grow: ${({ grow }) => grow && 1};
  gap: ${({ gap }) => (typeof gap === 'number' ? `${gap}rem` : gap)};
  grid-auto-flow: column;
  grid-template-columns: ${({ grow, children }) => {
    if (grow === 'first') return '1fr'
    if (grow === 'last') return `repeat(${Children.count(children) - 1}, auto) 1fr`
    if (grow) return `repeat(${Children.count(children)}, 1fr)`
    return undefined
  }};
  justify-content: ${({ justify, justifyContent }) => justify ?? justifyContent ?? 'space-between'};
  padding: ${({ pad }) => pad && `0 ${pad}rem`};
  ${({ paddingBottom }) => (paddingBottom ? `padding-bottom: ${paddingBottom};` : '')};
`

export const RowBetween = styled(Row)`
  justify-content: space-between;
`

export const RowFlat = styled.div`
  align-items: flex-end;
  display: flex;
`

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  justify-content: ${({ justify }) => justify && justify};
  margin: ${({ gap }) => gap && `-${gap}`};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  margin: ${({ gap }) => gap && `-${gap}`};
  width: fit-content;
`

export default Row
