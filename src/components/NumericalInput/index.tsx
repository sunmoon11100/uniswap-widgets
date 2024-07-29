import { SupportedLocale } from 'constants/locales'
import React, { forwardRef } from 'react'
import styled from 'styled-components/macro'
import { escapeRegExp } from 'utils'
import { useFormatterLocales } from 'utils/formatNumbers'

const StyledInput = styled.input<{ error?: boolean; fontSize?: string; align?: string; disabled?: boolean }>`
  -webkit-appearance: textfield;
  background-color: transparent;
  border: none;
  color: ${({ error, theme }) => (error ? theme.critical : theme.accent)};
  flex: 1 1 auto;
  font-size: ${({ fontSize }) => fontSize ?? '28px'};
  font-weight: 485;
  outline: none;
  overflow: hidden;
  padding: 0;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  position: relative;
  text-align: ${({ align }) => align && align};
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 0;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.accentSoft};
  }
`

function localeUsesComma(locale: SupportedLocale): boolean {
  const decimalSeparator = new Intl.NumberFormat(locale).format(1.1)[1]

  return decimalSeparator === ','
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export interface InputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'> {
  value: string | number
  onUserInput: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
  prependSymbol?: string
  placeholder?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function (
  { value, onUserInput, placeholder, prependSymbol, ...rest }: InputProps,
  ref
) {
  const { formatterLocale } = useFormatterLocales()

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  const formatValueWithLocale = (value: string | number) => {
    const [searchValue, replaceValue] = localeUsesComma(formatterLocale) ? [/\./g, ','] : [/,/g, '.']
    return value.toString().replace(searchValue, replaceValue)
  }

  const valueFormattedWithLocale = formatValueWithLocale(value)

  return (
    <StyledInput
      {...rest}
      ref={ref}
      value={prependSymbol && value ? prependSymbol + valueFormattedWithLocale : valueFormattedWithLocale}
      onChange={(event) => {
        if (prependSymbol) {
          const value = event.target.value

          // cut off prepended symbol
          const formattedValue = value.toString().includes(prependSymbol)
            ? value.toString().slice(1, value.toString().length + 1)
            : value

          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          enforcer(formattedValue.replace(/,/g, '.'))
        } else {
          enforcer(event.target.value.replace(/,/g, '.'))
        }
      }}
      // universal input options
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0'}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  )
})

Input.displayName = 'Input'

const MemoizedInput = React.memo(Input)
export { MemoizedInput as Input }
