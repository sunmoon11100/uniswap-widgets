import { Trans } from '@lingui/macro'
import { BigintIsh, Currency } from '@uniswap/sdk-core'
import { FeeAmount, Pool, TickDataProvider } from '@uniswap/v3-sdk'
import Column from 'components/Column'
import Row from 'components/Row'
import { StyledTokenButton } from 'components/TokenSelect/TokenButton'
import { ETH_BNB_CHAIN } from 'constants/tokens'
import JSBI from 'jsbi'
import { useState } from 'react'
import SelectToken from './SelectToken'
import { ThemedText } from 'theme'

export default function AddLiquidity() {
  const [tokenA, setTokenA] = useState<Currency>(ETH_BNB_CHAIN)
  const [tokenB, setTokenB] = useState<Currency>()
  const [fee, setFee] = useState<FeeAmount>()
  const [sqrtRatio, setSqrtRatio] = useState<BigintIsh>()
  const [liquidity, setLiquidity] = useState<BigintIsh>(JSBI.BigInt('1000000000000000000'))
  const [tickCurrent, setTickCurrent] = useState<number>()
  const [ticks, setTicks] = useState<TickDataProvider>()

  const handleSave = () => {
    // const pool = new Pool(tokenA, tokenB, fee, sqrtRatio, liquidity, tickCurrent, ticks)
  }

  return (
    <div>
      <Column gap={1}>
        <ThemedText.Body1>
          <Trans>Select pair</Trans>
        </ThemedText.Body1>

        <Row gap={0.5} flex>
          <div style={{ flexGrow: 1 }}>
            <SelectToken value={tokenA} onChange={setTokenA} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <SelectToken value={tokenB} onChange={setTokenB} />
          </div>
        </Row>

        <StyledTokenButton onClick={handleSave} color={'accent'}>
          <Trans>+ New Position</Trans>
        </StyledTokenButton>
      </Column>
    </div>
  )
}
