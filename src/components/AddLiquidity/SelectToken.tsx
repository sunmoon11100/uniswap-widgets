import { useIsSwapFieldIndependent, useSwapInfo } from 'hooks/swap'
import { SwapApprovalState } from 'hooks/swap/useSwapApproval'
import { usePrefetchCurrencyColor } from 'hooks/useCurrencyColor'
import { useState } from 'react'
import { TradeState } from 'state/routing/types'
import { Field } from 'state/swap'

import { Currency } from '@uniswap/sdk-core'
import TokenInput from 'components/Swap/TokenInput'

export default function SelectToken() {
  const {
    trade: { state: tradeState },
  } = useSwapInfo()

  const [currency, updateCurrency] = useState<Currency>()

  // extract eagerly in case of reversal
  usePrefetchCurrencyColor(currency)

  const isRouteLoading = tradeState === TradeState.LOADING
  const isDependentField = !useIsSwapFieldIndependent(Field.INPUT)
  const isLoading = isRouteLoading && isDependentField

  return (
    <TokenInput
      field={Field.INPUT}
      currency={currency}
      loading={isLoading}
      // approved={approvalState === SwapApprovalState.APPROVED}
      // disabled={isDisabled}
      onChangeCurrency={updateCurrency}
      hideInput={true}
    />
  )
}
