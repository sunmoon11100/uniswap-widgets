import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import { Position } from '@uniswap/v3-sdk'
import RangeBadge from 'components/Badge/RangeBadge'
import { LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo/DoubleCurrencyLogo'
import RateToggle from 'components/RateToggle'
import { RowBetween, RowFixed } from 'components/Row'
import JSBI from 'jsbi'
import { ReactNode, useCallback, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import { useFormatter } from 'utils/formatNumbers'
import { unwrappedToken } from 'utils/unwrappedToken'

export const Break = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  height: 1px;
  width: 100%;
`

export function PositionPreview({
  position,
  title,
  inRange,
  baseCurrencyDefault,
  ticksAtLimit,
}: {
  position: Position
  title?: ReactNode
  inRange: boolean
  baseCurrencyDefault?: Currency
  ticksAtLimit: { [bound: string]: boolean | undefined }
}) {
  const { formatTickPrice } = useFormatter()

  const currency0 = unwrappedToken(position.pool.token0)
  const currency1 = unwrappedToken(position.pool.token1)

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
        ? currency1
        : currency0
      : currency0
  )

  const sorted = baseCurrency === currency0
  const quoteCurrency = sorted ? currency1 : currency0

  const price = sorted ? position.pool.priceOf(position.pool.token0) : position.pool.priceOf(position.pool.token1)

  const priceLower = sorted ? position.token0PriceLower : position.token0PriceUpper.invert()
  const priceUpper = sorted ? position.token0PriceUpper : position.token0PriceLower.invert()

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency)
  }, [quoteCurrency])

  const removed = position?.liquidity && JSBI.equal(position?.liquidity, JSBI.BigInt(0))

  return (
    <AutoColumn gap="4px" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ marginBottom: '0.5rem' }}>
        <RowFixed>
          <DoubleCurrencyLogo
            currency0={currency0 ?? undefined}
            currency1={currency1 ?? undefined}
            // size={24}
            // margin={true}
          />
          <ThemedText.Body1 ml="10px" fontSize="24px">
            {currency0?.symbol} / {currency1?.symbol}
          </ThemedText.Body1>
        </RowFixed>
        <RangeBadge removed={removed} inRange={inRange} />
      </RowBetween>

      <LightCard>
        <AutoColumn gap="4px">
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency0} />
              <ThemedText.Body1 ml="8px">{currency0?.symbol}</ThemedText.Body1>
            </RowFixed>
            <RowFixed>
              <ThemedText.Body1 mr="8px">{position.amount0.toSignificant(4)}</ThemedText.Body1>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency1} />
              <ThemedText.Body1 ml="8px">{currency1?.symbol}</ThemedText.Body1>
            </RowFixed>
            <RowFixed>
              <ThemedText.Body1 mr="8px">{position.amount1.toSignificant(4)}</ThemedText.Body1>
            </RowFixed>
          </RowBetween>
          <Break />
          <RowBetween>
            <ThemedText.Body1>
              <Trans>Fee tier</Trans>
            </ThemedText.Body1>
            <ThemedText.Body1>
              <Trans>{position?.pool?.fee / 10000}%</Trans>
            </ThemedText.Body1>
          </RowBetween>
        </AutoColumn>
      </LightCard>

      <AutoColumn gap="4px">
        <RowBetween>
          {title ? <ThemedText.Body1>{title}</ThemedText.Body1> : <div />}
          <RateToggle
            currencyA={sorted ? currency0 : currency1}
            currencyB={sorted ? currency1 : currency0}
            handleRateToggle={handleRateChange}
          />
        </RowBetween>

        <RowBetween gap={'8px'}>
          <LightCard width="100%" padding="8px">
            <AutoColumn gap="4px" justify="center">
              <ThemedText.Body1 fontSize="12px">
                <Trans>Min price</Trans>
              </ThemedText.Body1>
              <ThemedText.Body1 textAlign="center">
                {formatTickPrice({
                  price: priceLower,
                  atLimit: ticksAtLimit,
                  direction: Bound.LOWER,
                })}
              </ThemedText.Body1>
              <ThemedText.Body1 textAlign="center" fontSize="12px">
                <Trans>
                  {quoteCurrency.symbol} per {baseCurrency.symbol}
                </Trans>
              </ThemedText.Body1>
              <ThemedText.Body2 textAlign="center" color="accent" style={{ marginTop: '4px' }}>
                <Trans>Your position will be 100% composed of {baseCurrency?.symbol} at this price</Trans>
              </ThemedText.Body2>
            </AutoColumn>
          </LightCard>

          <LightCard width="100%" padding="8px">
            <AutoColumn gap="4px" justify="center">
              <ThemedText.Body1 fontSize="12px">
                <Trans>Max price</Trans>
              </ThemedText.Body1>
              <ThemedText.Body1 textAlign="center">
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: ticksAtLimit,
                  direction: Bound.UPPER,
                })}
              </ThemedText.Body1>
              <ThemedText.Body1 textAlign="center" fontSize="12px">
                <Trans>
                  {quoteCurrency.symbol} per {baseCurrency.symbol}
                </Trans>
              </ThemedText.Body1>
              <ThemedText.Body2 textAlign="center" color="accent" style={{ marginTop: '4px' }}>
                <Trans>Your position will be 100% composed of {quoteCurrency?.symbol} at this price</Trans>
              </ThemedText.Body2>
            </AutoColumn>
          </LightCard>
        </RowBetween>
        <LightCard padding="12px ">
          <AutoColumn gap="4px" justify="center">
            <ThemedText.Body1 fontSize="12px">
              <Trans>Current price</Trans>
            </ThemedText.Body1>
            <ThemedText.Body1>{`${price.toSignificant(5)} `}</ThemedText.Body1>
            <ThemedText.Body1 textAlign="center" fontSize="12px">
              <Trans>
                {quoteCurrency.symbol} per {baseCurrency.symbol}
              </Trans>
            </ThemedText.Body1>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </AutoColumn>
  )
}
