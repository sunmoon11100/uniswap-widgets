import { largeIconCss } from 'icons'
import { PropsWithChildren, ReactElement } from 'react'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import Row from './Row'

export const HeaderRow = styled(Row)`
  // height: 1.5rem;
  margin: 0.5rem 1rem 0rem 1rem;
  ${largeIconCss}
`

export interface HeaderProps {
  title?: ReactElement
}

export default function Header({ title, children }: PropsWithChildren<HeaderProps>) {
  return (
    <HeaderRow iconSize={1.2} flex align="center" data-testid="header-container">
      {title && (
        <Row gap={0.5} data-testid="header-title">
          <ThemedText.Subhead1>{title}</ThemedText.Subhead1>
        </Row>
      )}
      {children && (
        <Row gap={1} data-testid="header-children">
          {children}
        </Row>
      )}
    </HeaderRow>
  )
}
