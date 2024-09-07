import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Percent, Price, Token } from '@uniswap/sdk-core'
import { Position } from '@uniswap/v3-sdk'
import RangeBadge from 'components/Badge/RangeBadge'
import Button from 'components/Button'
import Column from 'components/Column'
import HoverInlineText from 'components/HoverInlineText'
import { useLogo } from 'components/Logo'
import DoubleLogo from 'components/Logo/DoubleCurrencyLogo'
import { Loading } from 'components/Swap/Toolbar/Caption'
import { useToken } from 'hooks/useCurrency'
import useIsTickAtLimit from 'hooks/useIsTickAtLimit'
import { usePool } from 'hooks/usePools'
import { useMemo } from 'react'
import styled from 'styled-components'
import { HideSmall, MEDIA_WIDTHS, mediaWidth, SmallOnly, ThemedText } from 'theme'
import { Bound, formatTickPrice } from 'utils/formatNumbers'
import { unwrappedToken } from 'utils/unwrappedToken'

import { DAI, USDC_MAINNET, USDT, WBTC, WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'

const LinkRow = styled.div`
  align-items: center;
  border-bottom: solid 1px ${({ theme }) => theme.outline};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-weight: 535;
  justify-content: space-between;
  padding: 8px;
  text-decoration: none;
  user-select: none;

  & > div:not(:first-child) {
    text-align: center;
  }
  :hover {
    background-color: ${({ theme }) => theme.module};
  }

  @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
    /* flex-direction: row; */
  }

  ${({ theme }) => mediaWidth.deprecated_upToSmall`
    flex-direction: column;
    row-gap: 8px;
  `};
`

const DataLineItem = styled.div`
  font-size: 14px;
`

const RangeLineItem = styled(DataLineItem)`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`

// color: ${({ theme }) => theme.neutral1};
const DoubleArrow = styled.span`
  font-size: 12px;
  margin: 0 2px;
`

const RangeText = styled(ThemedText.Body2)`
  border-radius: 8px;
  font-size: 14px !important;
  padding: 0.25rem 0.25rem;
  word-break: break-word;
`

const FeeTierText = styled(ThemedText.Caption)`
  color: ${({ theme }) => theme.accent};
  font-size: 16px !important;
  margin-left: 8px !important;
`
const ExtentsText = styled(ThemedText.Body2)`
  color: ${({ theme }) => theme.accent};
  display: inline-block;
  line-height: 16px;
  margin-right: 4px !important;
`
// ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
//   display: none;
// `};

const PrimaryPositionIdData = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  > * {
    margin-right: 8px;
  }
`

interface PositionListItemProps {
  token0: string
  token1: string
  tokenId: BigNumber
  fee: number
  liquidity: BigNumber
  tickLower: number
  tickUpper: number
  onOpen?: () => void
  onDelete?: () => void
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency

  // if token0 is a dollar-stable asset, set it as the quote token
  const stables = [DAI, USDC_MAINNET, USDT]
  if (stables.some((stable) => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const bases = [...Object.values(WRAPPED_NATIVE_CURRENCY), WBTC]
  if (bases.some((base) => base && base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}

export default function PositionListItem({
  token0: token0Address,
  token1: token1Address,
  tokenId,
  fee: feeAmount,
  liquidity,
  tickLower,
  tickUpper,
  onOpen = () => null,
  onDelete = () => null,
}: PositionListItemProps) {
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // construct Position from details returned
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    if (pool) {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  // prices
  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  // check if price is within range
  const outOfRange: boolean = pool ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper : false

  const removed = liquidity?.eq(0)

  const { src: logoSrc1, invalidateSrc: invalidateLogoSrc1 } = useLogo(currencyBase)
  const { src: logoSrc2, invalidateSrc: invalidateLogoSrc2 } = useLogo(currencyQuote)

  return (
    <LinkRow onClick={() => onOpen()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <PrimaryPositionIdData>
          {/* should show the logo */}
          {/* <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={18} margin /> */}

          <DoubleLogo logo1={logoSrc1} onError1={invalidateLogoSrc1} logo2={logoSrc2} onError2={invalidateLogoSrc2} />
          <ThemedText.Subhead2>
            &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
          </ThemedText.Subhead2>

          <FeeTierText>
            <Trans>{new Percent(feeAmount, 1_000_000).toSignificant()}%</Trans>
          </FeeTierText>
        </PrimaryPositionIdData>
        <Column flex justify="space-between" align="flex-end" gap={0.25}>
          <RangeBadge removed={removed} inRange={!outOfRange} />
          <Button padding="4px 8px" style={{ width: 'fit-content' }} onClick={onDelete}>
            X
          </Button>
        </Column>
      </div>

      {priceLower && priceUpper ? (
        <RangeLineItem>
          <RangeText>
            <ExtentsText>
              <Trans>Min: </Trans>
            </ExtentsText>
            <Trans>
              <span>
                {formatTickPrice({
                  price: priceLower,
                  atLimit: tickAtLimit,
                  direction: Bound.LOWER,
                })}{' '}
              </span>
              <HoverInlineText text={currencyQuote?.symbol} /> per <HoverInlineText text={currencyBase?.symbol ?? ''} />
            </Trans>
          </RangeText>{' '}
          <HideSmall>
            <DoubleArrow>↔</DoubleArrow>{' '}
          </HideSmall>
          <SmallOnly>
            <DoubleArrow>↔</DoubleArrow>{' '}
          </SmallOnly>
          <RangeText>
            <ExtentsText>
              <Trans>Max:</Trans>
            </ExtentsText>
            <Trans>
              <span>
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: tickAtLimit,
                  direction: Bound.UPPER,
                })}{' '}
              </span>
              <span>{currencyQuote?.symbol}</span> <span></span>
              <HoverInlineText text={currencyQuote?.symbol} /> per{' '}
              <HoverInlineText maxCharacters={10} text={currencyBase?.symbol} />
            </Trans>
          </RangeText>
        </RangeLineItem>
      ) : (
        <Loading />
      )}
    </LinkRow>
  )
}
