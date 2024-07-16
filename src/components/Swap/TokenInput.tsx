import 'setimmediate'

import { Currency } from '@uniswap/sdk-core'
import { loadingTransitionCss } from 'css/loading'
import { forwardRef, PropsWithChildren, useCallback, useImperativeHandle, useRef } from 'react'
import { Field } from 'state/swap'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import { InteractiveContainerRounded } from 'components/container/interactive/InteractiveContainer'
import { Logo } from 'components/Logo'
import Column from '../Column'
import { DecimalInput } from '../Input'
import Row from '../Row'
import TokenSelect from '../TokenSelect'

const TokenInputRow = styled(Row)`
  grid-template-columns: 1fr;
`

const ValueInput = styled(DecimalInput)`
  color: ${({ theme }) => theme.primary};
  font-size: 1.8rem;

  ${loadingTransitionCss}
`

const TokenInputColumn = styled(Column)`
  // margin: 0.25rem 1rem 0;
`

export interface TokenInputHandle {
  focus: () => void
}

interface TokenInputProps {
  field?: Field
  amount?: string
  currency?: Currency
  approved?: boolean
  loading?: boolean
  disabled?: boolean
  disabledSelectToken?: boolean
  onChangeInput?: (input: string) => void
  onChangeCurrency?: (currency: Currency) => void
  hideInput?: boolean
}

export const TokenInput = forwardRef<TokenInputHandle, PropsWithChildren<TokenInputProps>>(function TokenInput(
  {
    field,
    amount,
    currency,
    approved,
    loading,
    disabled,
    disabledSelectToken,
    onChangeInput,
    onChangeCurrency,
    hideInput,
    children,
    ...rest
  },
  ref
) {
  const input = useRef<HTMLInputElement>(null)
  const onSelect = useCallback(
    (currency: Currency) => {
      if (onChangeCurrency) {
        onChangeCurrency(currency)
      }
      setImmediate(() => input.current?.focus())
    },
    [onChangeCurrency]
  )

  const focus = useCallback(() => {
    setImmediate(() => {
      input.current?.focus()
      // Bring the start of the input into view so its value is apparent to the user.
      // The cursor will remain at the end of the input, and may be hidden.
      input.current?.scrollTo(0, 0)
    })
  }, [])
  useImperativeHandle(ref, () => ({ focus }), [focus])

  const inputRow = (
    <TokenInputRow gap={0.5}>
      {currency && !hideInput ? <Logo currency={currency} symbol={currency.symbol} /> : null}
      {hideInput ? null : (
        <ThemedText.H1>
          <ValueInput
            value={amount ?? '0'}
            onChange={onChangeInput ?? (() => null)}
            disabled={disabled || !currency}
            isLoading={Boolean(loading)}
            ref={input}
          />
        </ThemedText.H1>
      )}
      <TokenSelect
        field={field}
        value={currency}
        approved={approved}
        disabled={disabled || disabledSelectToken}
        onSelect={onSelect}
        showLogo={hideInput}
      />
    </TokenInputRow>
  )

  return (
    <TokenInputColumn gap={0.25} {...rest}>
      {hideInput ? (
        inputRow
      ) : (
        <InteractiveContainerRounded style={{ padding: '4px 12px' }}>{inputRow}</InteractiveContainerRounded>
      )}
      {children}
    </TokenInputColumn>
  )
})

export default TokenInput
