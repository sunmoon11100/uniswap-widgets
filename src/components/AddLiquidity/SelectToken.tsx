import { Currency } from '@uniswap/sdk-core'
import TokenInput from 'components/Swap/TokenInput'
import { useIsSwapFieldIndependent, useSwapInfo } from 'hooks/swap'
import { usePrefetchCurrencyColor } from 'hooks/useCurrencyColor'
import { TradeState } from 'state/routing/types'
import { Field } from 'state/swap'

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
      amount={'0'}
      onChangeCurrency={onChange}
      onChangeInput={() => {
        return
      }}
    />
  )
}
