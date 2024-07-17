import { Trans } from '@lingui/macro'
import { BigintIsh } from '@uniswap/sdk-core'
import { FeeAmount, TickDataProvider } from '@uniswap/v3-sdk'
import Column from 'components/Column'
import { StyledTokenButton } from 'components/TokenSelect/TokenButton'
import ScrollContainer from 'components/container/scroll-container'
import { useSwapCurrency } from 'hooks/swap'
import JSBI from 'jsbi'
import { useRef, useState } from 'react'
import { Field } from 'state/swap'
import { ThemedText } from 'theme'
import DepositInput from './DepositInput'
import FeeSelect from './FeeSelect'
import PriceRange from './PriceRange'
import SelectToken from './SelectToken'

export default function AddLiquidity() {
  const contentRef = useRef<HTMLDivElement>(null)

  const [tokenA, setTokenA] = useSwapCurrency(Field.INPUT)
  const [tokenB, setTokenB] = useSwapCurrency(Field.OUTPUT)
  const [fee, setFee] = useState<FeeAmount>(FeeAmount.LOW)
  const [sqrtRatio, setSqrtRatio] = useState<BigintIsh>()
  const [liquidity, setLiquidity] = useState<BigintIsh>(JSBI.BigInt('1000000000000000000'))
  const [tickCurrent, setTickCurrent] = useState<number>()
  const [ticks, setTicks] = useState<TickDataProvider>()

  const isTokensSelected = tokenA?.chainId && tokenB?.chainId

  const handleSave = () => {
    // const pool = new Pool(tokenA, tokenB, fee, sqrtRatio, liquidity, tickCurrent, ticks)
  }

  return (
    <ScrollContainer>
      <Column gap={1}>
        <ThemedText.Body1>
          <Trans>Select pair</Trans>
        </ThemedText.Body1>

        <Column gap={0.5} flex align="stretch">
          <SelectToken value={tokenA} onChange={setTokenA} />
          <SelectToken value={tokenB} onChange={setTokenB} />
        </Column>

        {isTokensSelected ? (
          <>
            <FeeSelect value={fee} onChange={setFee} />

            <PriceRange />

            <DepositInput />

            <StyledTokenButton onClick={handleSave} color={'accent'}>
              <Trans>+ New Position</Trans>
            </StyledTokenButton>
          </>
        ) : null}
      </Column>
    </ScrollContainer>
  )
}
