import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import Column from 'components/Column'
import TokenInput from 'components/Swap/TokenInput'
import React from 'react'
import { ThemedText } from 'theme'

function DepositInput({ tokenA, tokenB }: { tokenA?: Currency; tokenB?: Currency }) {
  return (
    <Column gap={0.5}>
      <ThemedText.Body1>
        <Trans>Deposit amounts</Trans>
      </ThemedText.Body1>
      <TokenInput currency={tokenA} disabledSelectToken />
      <TokenInput currency={tokenB} disabledSelectToken />
    </Column>
  )
}

export default DepositInput
