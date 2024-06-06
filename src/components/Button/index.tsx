import { darken } from 'polished'
import { forwardRef } from 'react'
import { Check, ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps as ButtonPropsOriginal } from 'rebass/styled-components'
import styled, { DefaultTheme, useTheme } from 'styled-components'

import { RowBetween } from '../Row/index'

export { default as LoadingButtonSpinner } from './LoadingButtonSpinner'

type ButtonProps = Omit<ButtonPropsOriginal, 'css'>

const ButtonOverlay = styled.div`
  background-color: transparent;
  bottom: 0;
  border-radius: inherit;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: 150ms ease background-color;
  width: 100%;
`

type BaseButtonProps = {
  padding?: string
  width?: string
  $borderRadius?: string
  altDisabledStyle?: boolean
} & ButtonProps

export const BaseButton = styled(RebassButton)<BaseButtonProps>`
  padding: ${({ padding }) => padding ?? '16px'};
  width: ${({ width }) => width ?? '100%'};
  line-height: 24px;
  font-weight: 535;
  text-align: center;
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '16px'};
  outline: none;
  border: 1px solid transparent;
  color: #ffffff;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    opacity: 50%;
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`

export const ButtonPrimary = styled(BaseButton)`
  background-color: #fc72ff;
  font-size: 20px;
  font-weight: 535;
  padding: 16px;
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt #fc72ff;
    background-color: #fc72ff;
  }
  &:hover {
    background-color: #fc72ff;
  }
  &:active {
    box-shadow: 0 0 0 1pt #fc72ff;
    background-color: #fc72ff;
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? '#FC72FF' : '#FFFFFF12') : '#FFFFFF12'};
    color: ${({ altDisabledStyle, disabled, theme }) =>
      altDisabledStyle ? (disabled ? 'white' : '#9B9B9B') : '#9B9B9B'};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
  }
`

export const SmallButtonPrimary = styled(ButtonPrimary)`
  width: auto;
  font-size: 16px;
  padding: ${({ padding }) => padding ?? '8px 12px'};

  border-radius: 12px;
`

const BaseButtonLight = styled(BaseButton)`
  background-color: #311c31;
  color: '#FC72FF';
  font-size: 20px;
  font-weight: 535;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && '#311C31'};
    background-color: ${({ theme, disabled }) => !disabled && '#311C31'};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && '#311C31'};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && '#311C31'};
    background-color: ${({ theme, disabled }) => !disabled && '#311C31'};
  }

  :hover {
    ${ButtonOverlay} {
      background-color: #98a1c0;
    }
  }

  :active {
    ${ButtonOverlay} {
      background-color: #b8c0dc;
    }
  }

  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: transparent;
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

export const ButtonGray = styled(BaseButton)`
  background-color: #131313;
  color: #9b9b9b;
  border: 1px solid #ffffff12;
  font-size: 16px;
  font-weight: 535;

  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && '#1B1B1B'};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && '#1B1B1B'};
  }
`

export const ButtonSecondary = styled(BaseButton)`
  border: 1px solid #311c31;
  color: '#FC72FF';
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt #311c31;
    border: 1px solid '#FC72FF';
  }
  &:hover {
    border: 1px solid #fc72ff;
  }
  &:active {
    box-shadow: 0 0 0 1pt #311c31;
    border: 1px solid #fc72ff;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonOutlined = styled(BaseButton)`
  border: 1px solid #ffffff12;
  background-color: transparent;
  color: #ffffff;
  &:focus {
    box-shadow: 0 0 0 1px #ffffff12;
  }
  &:hover {
    box-shadow: 0 0 0 1px #5e5e5e;
  }
  &:active {
    box-shadow: 0 0 0 1px #ffffff12;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(BaseButton)`
  background-color: transparent;
  color: #fc72ff;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonText = styled(BaseButton)`
  padding: 0;
  width: fit-content;
  background: none;
  text-decoration: none;
  &:focus {
    text-decoration: underline;
  }
  &:hover {
    opacity: 0.9;
  }
  &:active {
    text-decoration: underline;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(BaseButton)`
  background-color: #1b1b1b;
  color: #ffffff;
  /* border: 1px solid ${({ theme }) => theme.success}; */

  &:disabled {
    opacity: 50%;
    background-color: #ffffff12;
    color: #9b9b9b;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(BaseButton)`
  background-color: #ff5f52;
  border: 1px solid #ff5f52;

  &:focus {
    box-shadow: 0 0 0 1pt #ff5f52;
    background-color: #ff5f52;
  }
  &:hover {
    background-color: #ff5f52;
  }
  &:active {
    box-shadow: 0 0 0 1pt #ff5f52;
    background-color: #ff5f52;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: #ff5f52;
    border: 1px solid #ff5f52;
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & BaseButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

const ActiveOutlined = styled(ButtonOutlined)`
  border: 1px solid;
  border-color: #fc72ff;
`

const Circle = styled.div`
  height: 17px;
  width: 17px;
  border-radius: 50%;
  background-color: #fc72ff;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CheckboxWrapper = styled.div`
  width: 20px;
  padding: 0 10px;
  position: absolute;
  top: 11px;
  right: 15px;
`

const ResponsiveCheck = styled(Check)`
  size: 13px;
`

export function ButtonRadioChecked({ active = false, children, ...rest }: { active?: boolean } & ButtonProps) {
  const theme = useTheme()

  if (!active) {
    return (
      <ButtonOutlined $borderRadius="12px" padding="12px 8px" {...rest}>
        <RowBetween>{children}</RowBetween>
      </ButtonOutlined>
    )
  } else {
    return (
      <ActiveOutlined {...rest} padding="12px 8px" $borderRadius="12px">
        <RowBetween>
          {children}
          <CheckboxWrapper>
            <Circle>
              <ResponsiveCheck size={13} stroke="white" />
            </Circle>
          </CheckboxWrapper>
        </RowBetween>
      </ActiveOutlined>
    )
  }
}

export enum ButtonSize {
  small,
  medium,
  large,
}
export enum ButtonEmphasis {
  high,
  promotional,
  highSoft,
  medium,
  low,
  warning,
  destructive,
  failure,
}
interface BaseThemeButtonProps {
  size: ButtonSize
  emphasis: ButtonEmphasis
}

function pickThemeButtonBackgroundColor({ theme, emphasis }: { theme: DefaultTheme; emphasis: ButtonEmphasis }) {
  switch (emphasis) {
    case ButtonEmphasis.high:
      return '#FC72FF'
    case ButtonEmphasis.promotional:
    case ButtonEmphasis.highSoft:
      return '#311C31'
    case ButtonEmphasis.low:
      return 'transparent'
    case ButtonEmphasis.warning:
      return '#EEB317'
    case ButtonEmphasis.destructive:
      return '#FF5F52'
    case ButtonEmphasis.failure:
      return '#FF5F52'
    case ButtonEmphasis.medium:
    default:
      return '#FFFFFF12'
  }
}
function pickThemeButtonFontSize({ size }: { size: ButtonSize }) {
  switch (size) {
    case ButtonSize.large:
      return '20px'
    case ButtonSize.medium:
      return '16px'
    case ButtonSize.small:
      return '14px'
    default:
      return '16px'
  }
}
function pickThemeButtonLineHeight({ size }: { size: ButtonSize }) {
  switch (size) {
    case ButtonSize.large:
      return '24px'
    case ButtonSize.medium:
      return '20px'
    case ButtonSize.small:
      return '16px'
    default:
      return '20px'
  }
}
function pickThemeButtonPadding({ size }: { size: ButtonSize }) {
  switch (size) {
    case ButtonSize.large:
      return '16px'
    case ButtonSize.medium:
      return '10px 12px'
    case ButtonSize.small:
      return '8px'
    default:
      return '10px 12px'
  }
}
function pickThemeButtonTextColor({ theme, emphasis }: { theme: DefaultTheme; emphasis: ButtonEmphasis }) {
  switch (emphasis) {
    case ButtonEmphasis.high:
    case ButtonEmphasis.promotional:
      return '#FC72FF'
    case ButtonEmphasis.highSoft:
      return '#FC72FF'
    case ButtonEmphasis.low:
      return '#9B9B9B'
    case ButtonEmphasis.warning:
      return '#EEB317'
    case ButtonEmphasis.destructive:
      return '#FFFFFF'
    case ButtonEmphasis.failure:
      return '#FF5F52'
    case ButtonEmphasis.medium:
    default:
      return '#FFFFFF'
  }
}

const BaseThemeButton = styled.button<BaseThemeButtonProps>`
  align-items: center;
  background-color: ${pickThemeButtonBackgroundColor};
  border-radius: 16px;
  border: 0;
  color: ${pickThemeButtonTextColor};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: ${pickThemeButtonFontSize};
  font-weight: 535;
  gap: 12px;
  justify-content: center;
  line-height: ${pickThemeButtonLineHeight};
  padding: ${pickThemeButtonPadding};
  position: relative;
  transition: 150ms ease opacity;
  user-select: none;

  :active {
    ${ButtonOverlay} {
      background-color: '#B8C0DC';
    }
  }
  :focus {
    ${ButtonOverlay} {
      background-color: '#B8C0DC';
    }
  }
  :hover {
    ${ButtonOverlay} {
      background-color: '#98A1C0';
    }
  }
  :disabled {
    cursor: default;
    opacity: 0.6;
  }
  :disabled:active,
  :disabled:focus,
  :disabled:hover {
    ${ButtonOverlay} {
      background-color: transparent;
    }
  }
`

interface ThemeButtonProps extends React.ComponentPropsWithoutRef<'button'>, BaseThemeButtonProps {}
type ThemeButtonRef = HTMLButtonElement

export const ThemeButton = forwardRef<ThemeButtonRef, ThemeButtonProps>(function ThemeButton(
  { children, ...rest },
  ref
) {
  return (
    <BaseThemeButton {...rest} ref={ref}>
      <ButtonOverlay />
      {children}
    </BaseThemeButton>
  )
})

export const ButtonLight = ({ children, ...rest }: BaseButtonProps) => {
  return (
    <BaseButtonLight {...rest}>
      <ButtonOverlay />
      {children}
    </BaseButtonLight>
  )
}
