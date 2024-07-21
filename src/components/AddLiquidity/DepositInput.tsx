import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import Column from 'components/Column'
import { FieldWrapper } from 'components/Swap/Input'
import { CaptionRow } from 'components/Swap/Toolbar'
import { useSwapInfo } from 'hooks/swap'
import { SwapApprovalState } from 'hooks/swap/useSwapApproval'
import React, { useMemo } from 'react'
import { Field } from 'state/swap'
import { ThemedText } from 'theme'
import { maxAmountSpend } from 'utils/maxAmountSpend'

function DepositInput({ tokenA, tokenB }: { tokenA?: Currency; tokenB?: Currency }) {
  const {
    [Field.INPUT]: { balance, amount: currencyAmount },
    approval: { state: approvalState },
  } = useSwapInfo()

  const maxAmount = useMemo(() => {
    // account for gas needed if using max on native token
    const max = maxAmountSpend(balance)
    if (!max || !balance) return
    if (max.equalTo(0) || balance.lessThan(max)) return
    if (currencyAmount && max.equalTo(currencyAmount)) return
    return max.toExact()
  }, [balance, currencyAmount])

  return (
    <Column gap={0.5}>
      <ThemedText.Body1>
        <Trans>Deposit amounts</Trans>
      </ThemedText.Body1>
      <FieldWrapper
        field={Field.INPUT}
        maxAmount={maxAmount}
        approved={approvalState === SwapApprovalState.APPROVED}
        subheader={''}
      />
      <FieldWrapper
        field={Field.OUTPUT}
        maxAmount={maxAmount}
        approved={approvalState === SwapApprovalState.APPROVED}
        subheader={''}
      />

      <CaptionRow />
    </Column>
  )
}

export default DepositInput
