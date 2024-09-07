import { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'

const StyledRangeInput = styled.input<{ size: number }>`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  background: transparent; /* Specific width is required for Firefox. */
  cursor: pointer; /* Otherwise white in Chrome */
  width: 100%;

  &:focus {
    outline: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: ${({ theme }) => theme.accent};
    border: none;
    border-radius: 100%;
    color: ${({ theme }) => theme.container};
    height: ${({ size }) => size}px;
    transform: translateY(-50%);
    width: ${({ size }) => size}px;

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-moz-range-thumb {
    background-color: #565a69;
    border: none;
    border-radius: 100%;
    color: ${({ theme }) => theme.container};
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-ms-thumb {
    background-color: #565a69;
    border-radius: 100%;
    color: ${({ theme }) => theme.container};
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-webkit-slider-runnable-track {
    background: linear-gradient(90deg, ${({ theme }) => theme.accent}, ${({ theme }) => theme.accent});
    height: 2px;
  }

  &::-moz-range-track {
    background: linear-gradient(90deg, ${({ theme }) => theme.outline}, ${({ theme }) => theme.module});
    height: 2px;
  }

  &::-ms-track {
    background: ${({ theme }) => theme.outline};
    border-color: transparent;
    color: transparent;

    height: 2px;
    width: 100%;
  }
  &::-ms-fill-lower {
    background: ${({ theme }) => theme.outline};
  }
  &::-ms-fill-upper {
    background: ${({ theme }) => theme.module};
  }
`

interface InputSliderProps {
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  size?: number
}

export default function Slider({
  value,
  onChange,
  min = 0,
  step = 1,
  max = 100,
  size = 28,
  ...rest
}: InputSliderProps) {
  const changeCallback = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value))
    },
    [onChange]
  )

  return (
    <StyledRangeInput
      size={size}
      {...rest}
      type="range"
      value={value}
      style={{ padding: '15px 0' }}
      onChange={changeCallback}
      aria-labelledby="input slider"
      step={step}
      min={min}
      max={max}
    />
  )
}
