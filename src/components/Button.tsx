import { Icon } from 'icons'
import { darken } from 'polished'
import { ComponentProps, forwardRef } from 'react'
import { ButtonProps } from 'rebass'
import styled, { useTheme } from 'styled-components/macro'
import { AnimationSpeed, Color } from 'theme'
import { RowBetween } from './Row'
import { Check } from 'react-feather'

// type ButtonProps = Omit<ButtonPropsOriginal, 'css'>

export type BaseButtonProps = {
  padding?: string
  width?: string
  $borderRadius?: string
  altDisabledStyle?: boolean
}

export const BaseButton = styled.button<BaseButtonProps>`
  position: relative;
  background-color: transparent;
  border: none;
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '0.5rem'};
  color: currentColor;
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  height: inherit;
  line-height: inherit;
  margin: 0;
  padding: ${({ padding }) => padding ?? '0'};
  width: ${({ width }) => width ?? '100%'};

  :enabled {
    transition: filter ${AnimationSpeed.Fast} linear;
  }

  :disabled {
    cursor: initial;
    filter: opacity(0.6);
  }
`

export default styled(BaseButton)<{ color?: Color }>`
  background-color: ${({ color = 'interactive', theme }) => theme[color]};
  border: 1px solid transparent;
  color: ${({ color = 'interactive', theme }) => color === 'interactive' && theme.onInteractive};

  :enabled:hover {
    background-color: ${({ color = 'interactive', theme }) => theme.onHover(theme[color])};
  }
`

const transparentButton = (defaultColor: Color) => styled(BaseButton)<{ color?: Color }>`
  color: ${({ color = defaultColor, theme }) => theme[color]};

  :enabled:hover {
    color: ${({ color = defaultColor, theme }) => theme.onHover(theme[color])};
    * {
      color: ${({ color = defaultColor, theme }) => theme.onHover(theme[color])};
    }
  }
`

export const TextButton = transparentButton('accent')

const SecondaryButton = transparentButton('secondary')

const StyledIconButton = styled(SecondaryButton)`
  height: 1rem;
`

interface IconButtonProps {
  icon: Icon
  iconProps?: ComponentProps<Icon>
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps & ComponentProps<typeof BaseButton>>(
  function IconButton({ icon: Icon, iconProps, ...props }: IconButtonProps & ComponentProps<typeof BaseButton>, ref) {
    return (
      <StyledIconButton {...props} ref={ref}>
        <Icon {...iconProps} />
      </StyledIconButton>
    )
  }
)

export const ButtonGray = styled(BaseButton)`
  background-color: ${({ theme }) => theme.interactive};
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.hint};
  font-size: 16px;
  font-weight: 535;

  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.interactive)};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.interactive)};
  }
`

export const ButtonOutlined = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.hint};
  background-color: transparent;
  color: ${({ theme }) => theme.primary};
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.outline};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.accentSoft};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.outline};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ActiveOutlined = styled(ButtonOutlined)`
  border: 1px solid;
  border-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.primary};
`

const CheckboxWrapper = styled.div`
  width: 20px;
  padding: 0 10px;
  position: absolute;
  top: 11px;
  right: 15px;
`

const Circle = styled.div`
  height: 17px;
  width: 17px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.accent};
  display: flex;
  align-items: center;
  justify-content: center;
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
              <ResponsiveCheck size={13} stroke={theme.primary} />
            </Circle>
          </CheckboxWrapper>
        </RowBetween>
      </ActiveOutlined>
    )
  }
}

export const ButtonEmpty = styled(BaseButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.accent};
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

export const ButtonPrimary = styled(BaseButton)`
  background-color: ${({ theme }) => theme.accent};
  font-size: 20px;
  font-weight: 535;
  padding: ${({ padding }) => padding ?? '16px'};
  color: ${({ theme }) => 'white'};
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.accent)};
    background-color: ${({ theme }) => darken(0.05, theme.accent)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.accent)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.accent)};
    background-color: ${({ theme }) => darken(0.1, theme.accent)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.accent : theme.outline) : theme.outline};
    color: white;
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
  }
`

const ButtonConfirmedStyle = styled(BaseButton)`
  background-color: ${({ theme }) => theme.module};
  color: ${({ theme }) => theme.warning};
  /* border: 1px solid ${({ theme }) => theme.success}; */

  &:disabled {
    opacity: 50%;
    background-color: ${({ theme }) => theme.module};
    color: ${({ theme }) => theme.warningSoft};
    cursor: auto;
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

export const SmallButtonPrimary = styled(ButtonPrimary)`
  width: auto;
  font-size: 16px;
  padding: ${({ padding }) => padding ?? '8px 12px'};

  border-radius: 12px;
`
