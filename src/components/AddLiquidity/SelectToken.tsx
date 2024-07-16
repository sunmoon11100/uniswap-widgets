import { useIsSwapFieldIndependent, useSwapInfo } from 'hooks/swap'
import { SwapApprovalState } from 'hooks/swap/useSwapApproval'
import { usePrefetchCurrencyColor } from 'hooks/useCurrencyColor'
import { useState } from 'react'
import { TradeState } from 'state/routing/types'
import { Field } from 'state/swap'

import { Currency, Token } from '@uniswap/sdk-core'
import TokenInput from 'components/Swap/TokenInput'

export default function SelectToken({ value, onChange }: { value?: Currency; onChange: (v: Currency) => void }) {
  const {
    trade: { state: tradeState },
  } = useSwapInfo()

  // extract eagerly in case of reversal
  usePrefetchCurrencyColor(value)

  const isRouteLoading = tradeState === TradeState.LOADING
  const isDependentField = !useIsSwapFieldIndependent(Field.INPUT)
  const isLoading = isRouteLoading && isDependentField

  return (
    <TokenInput
      field={Field.INPUT}
      currency={value}
      loading={isLoading}
      // approved={approvalState === SwapApprovalState.APPROVED}
      // disabled={isDisabled}
      onChangeCurrency={onChange}
      hideInput={true}
    />
  )
}
