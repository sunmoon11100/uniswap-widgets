import { t, Trans } from '@lingui/macro'
import { formatCurrencyAmount, NumberType } from '@uniswap/conedison/format'
import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { TextButton } from 'components/Button'
import { ResponsiveDialog } from 'components/ResponsiveDialog'
import Row from 'components/Row'
import { Balance } from 'components/Swap/Input'
import { PriceImpactRow } from 'components/Swap/PriceImpactRow'
import { TokenInputColumn, TokenInputRow, ValueInput } from 'components/Swap/TokenInput'
import { TokenSelectDialogContent } from 'components/TokenSelect'
import TokenButton from 'components/TokenSelect/TokenButton'
import { loadingTransitionCss } from 'css/loading'
import { useNativeCurrencyBalances, useTokenBalances } from 'hooks/useCurrencyBalance'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import tryParseCurrencyAmount from 'utils/tryParseCurrencyAmount'

const USDC = styled(Row)`
  ${loadingTransitionCss};
  gap: 0.25rem;
`

function CurrencyInputPanel({
  value = '',
  onUserInput = () => null,
  hideInput,
  onMax,
  onCurrencySelect = () => null,
  showMaxButton,
  currency,
  showCommonBases,
  disabledCurrency,
}: {
  value?: string
  onUserInput?: (v: string) => void
  hideInput?: boolean
  onMax?: () => void
  onCurrencySelect?: (v: Currency) => void
  showMaxButton?: boolean
  currency?: Currency
  showCommonBases?: boolean
  disabledCurrency?: boolean
} = {}) {
  const { account, chainId, isActivating, isActive } = useWeb3React()

  const tokens = useMemo(() => (currency?.isToken ? [currency] : []), [currency])

  const tokenBalances = useTokenBalances(account, tokens)
  const ethBalance = useNativeCurrencyBalances([account])

  const balance = currency?.isToken
    ? tokenBalances[currency.address]
    : currency?.isNative && account
    ? ethBalance[account]
    : null

  const amount = tryParseCurrencyAmount(value, currency)
  const usdc = useUSDCValue(amount)

  const maxAmount = useMemo(() => {
    // account for gas needed if using max on native token
    const max = maxAmountSpend(balance ?? undefined)
    if (!max || !balance) return
    if (max.equalTo(0) || balance.lessThan(max)) return
    if (amount && max.equalTo(amount)) return
    return max.toExact()
  }, [balance, amount])

  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)

  const onClickMax = useCallback(() => {
    if (!maxAmount) return
    onUserInput(maxAmount)
  }, [maxAmount, onUserInput])

  return (
    <div>
      <TokenInputColumn gap={0.25}>
        <TokenInputRow gap={0.5}>
          {hideInput ? null : (
            <ThemedText.H1>
              <ValueInput
                value={value}
                onChange={onUserInput}
                //   disabled={disabled || !currency}
                //   isLoading={Boolean(loading)}
                isLoading={false}
                //   ref={input}
                //   ref={input}
              />
            </ThemedText.H1>
          )}
          <TokenButton
            value={currency}
            //   approved={approved}
            //   disabled={disabled || !currency}
            disabled={disabledCurrency}
            onClick={handleOpen}
          />
          <ResponsiveDialog open={isOpen} setOpen={setIsOpen}>
            <TokenSelectDialogContent
              value={currency}
              onSelect={(v) => {
                onCurrencySelect(v)
                setIsOpen(false)
              }}
              onClose={() => setIsOpen(false)}
            />
          </ResponsiveDialog>
        </TokenInputRow>
        <ThemedText.Body2 color="secondary" userSelect>
          <Row>
            <USDC isLoading={false}>
              {usdc && `${formatCurrencyAmount(usdc, NumberType.FiatTokenQuantity)}`}
              <PriceImpactRow
                // impact={fiatValueChange}
                impact={undefined}
                tooltipText={t`The estimated difference between the USD values of input and output amounts.`}
              />
            </USDC>
            {balance && (
              <Row gap={0.5}>
                <Balance color="secondary">
                  <Trans>Balance:</Trans> {formatCurrencyAmount(balance)}
                </Balance>
                {maxAmount && (
                  <TextButton onClick={onClickMax}>
                    <ThemedText.ButtonSmall>
                      <Trans>Max</Trans>
                    </ThemedText.ButtonSmall>
                  </TextButton>
                )}
              </Row>
            )}
          </Row>
        </ThemedText.Body2>
      </TokenInputColumn>
    </div>
  )
}

export default CurrencyInputPanel
