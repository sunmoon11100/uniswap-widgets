import { readableColor } from 'polished'
import { PropsWithChildren } from 'react'
import styled, { DefaultTheme } from 'styled-components'

export enum BadgeVariant {
  DEFAULT = 'DEFAULT',
  NEGATIVE = 'NEGATIVE',
  POSITIVE = 'POSITIVE',
  PRIMARY = 'PRIMARY',
  WARNING = 'WARNING',
  PROMOTIONAL = 'PROMOTIONAL',
  BRANDED = 'BRANDED',
  SOFT = 'SOFT',

  WARNING_OUTLINE = 'WARNING_OUTLINE',
}

interface BadgeProps {
  variant?: BadgeVariant
}

function pickBackgroundColor(variant: BadgeVariant | undefined, theme: DefaultTheme): string {
  switch (variant) {
    case BadgeVariant.BRANDED:
      return theme.accent
    case BadgeVariant.PROMOTIONAL:
      return theme.active
    case BadgeVariant.NEGATIVE:
      return theme.warning
    case BadgeVariant.POSITIVE:
      return theme.success
    case BadgeVariant.SOFT:
      return theme.accentSoft
    case BadgeVariant.PRIMARY:
      return theme.accent
    case BadgeVariant.WARNING:
      return theme.warningSoft
    case BadgeVariant.WARNING_OUTLINE:
      return 'transparent'
    default:
      return theme.container
  }
}

function pickBorder(variant: BadgeVariant | undefined, theme: DefaultTheme): string {
  switch (variant) {
    case BadgeVariant.WARNING_OUTLINE:
      return `1px solid ${theme.warningSoft}`
    default:
      return 'unset'
  }
}

function pickFontColor(variant: BadgeVariant | undefined, theme: DefaultTheme): string {
  switch (variant) {
    case BadgeVariant.BRANDED:
      return 'white'
    case BadgeVariant.NEGATIVE:
      return readableColor(theme.critical)
    case BadgeVariant.POSITIVE:
      return readableColor(theme.success)
    case BadgeVariant.SOFT:
      return theme.accent
    case BadgeVariant.WARNING:
      return readableColor(theme.warningSoft)
    case BadgeVariant.WARNING_OUTLINE:
      return theme.warningSoft
    default:
      return readableColor(theme.accent)
  }
}

const Badge = styled.div<PropsWithChildren<BadgeProps>>`
  align-items: center;
  background: ${({ theme, variant }) => pickBackgroundColor(variant, theme)};
  border: ${({ theme, variant }) => pickBorder(variant, theme)};
  border-radius: 0.5rem;
  color: ${({ theme, variant }) => pickFontColor(variant, theme)};
  display: inline-flex;
  padding: 4px 6px;
  justify-content: center;
  font-weight: 535;
`

export default Badge
