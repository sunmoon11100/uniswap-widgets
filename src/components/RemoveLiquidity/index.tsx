import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { useTrace } from '@uniswap/analytics'
import { LiquidityEventName, LiquiditySource } from '@uniswap/analytics-events'
import { CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { NonfungiblePositionManager } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import { sendAnalyticsEvent } from 'analytics'
import RangeBadge from 'components/Badge/RangeBadge'
import { ButtonConfirmed, ButtonPrimary } from 'components/Button'
import { LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import Dialog, { Header } from 'components/Dialog'
import FormattedCurrencyAmount from 'components/FormattedCurrencyAmount'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo/DoubleCurrencyLogo'
import { Break } from 'components/PositionPreview'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import ScrollablePage from 'components/scrollable-page'
import Slider from 'components/Slider'
import Toggle from 'components/Toggle'
import { isSupportedChainId } from 'constants/chainInfo'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import useDebouncedChangeHandler from 'hooks/useDebouncedChangeHandler'
import useNativeCurrency from 'hooks/useNativeCurrency'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useV3PositionFromTokenId } from 'hooks/useV3Positions'
import { useCallback, useMemo, useState } from 'react'
import { Loader } from 'react-feather'
import { Text } from 'rebass'
import { useBurnV3ActionHandlers, useBurnV3State, useDerivedV3BurnInfo } from 'state/burn/v3/hooks'
import { useTheme } from 'styled-components'
import { ThemedText } from 'theme'
import { WrongChainError } from 'utils/errors'

import { WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { ResponsiveHeaderText, SmallMaxButton } from './styled'

const DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

// redirect invalid tokenIds
export default function RemoveLiquidity({
  tokenId,
  onClose = () => null,
  onReload = () => null,
}: {
  tokenId?: BigNumber
  onClose?: () => void
  onReload?: () => void
}) {
  const { chainId } = useWeb3React()
  const parsedTokenId = useMemo(() => {
    try {
      return BigNumber.from(tokenId)
    } catch {
      return null
    }
  }, [tokenId])

  const { position, loading } = useV3PositionFromTokenId(parsedTokenId ?? undefined)
  if (parsedTokenId === null || parsedTokenId.eq(0)) {
    onClose()
    return null
  }
  if (isSupportedChainId(chainId) && (loading || position)) {
    return <Remove tokenId={parsedTokenId} onReload={onReload} />
  } else {
    onClose()
    return null
  }
}

function Remove({ tokenId, onReload = () => null }: { tokenId: BigNumber; onReload?: () => void }) {
  const { position } = useV3PositionFromTokenId(tokenId)
  const theme = useTheme()
  const { account, chainId, provider } = useWeb3React()
  const trace = useTrace()

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency()
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol

  // burn state
  const { percent } = useBurnV3State()
  const {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  } = useDerivedV3BurnInfo(position, receiveWETH)
  const { onPercentSelect } = useBurnV3ActionHandlers()

  const removed = position?.liquidity?.eq(0)

  // boilerplate for the slider
  const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)

  const deadline = useTransactionDeadline() // custom from users settings
  // const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users
  const allowedSlippage = DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE // custom from users

  const [showConfirm, setShowConfirm] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [txnHash, setTxnHash] = useState<string | undefined>()
  // const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract()
  const burn = useCallback(async () => {
    setAttemptingTxn(true)
    if (
      !positionManager ||
      !liquidityValue0 ||
      !liquidityValue1 ||
      !deadline ||
      !account ||
      !chainId ||
      !positionSDK ||
      !liquidityPercentage ||
      !provider
    ) {
      return
    }

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.removeCallParameters(positionSDK, {
      tokenId: tokenId.toString(),
      liquidityPercentage,
      slippageTolerance: allowedSlippage,
      deadline: deadline.toString(),
      collectOptions: {
        expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(liquidityValue0.currency, 0),
        expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(liquidityValue1.currency, 0),
        recipient: account,
      },
    })

    const txn = {
      to: positionManager.address,
      data: calldata,
      value,
    }

    const connectedChainId = await provider.getSigner().getChainId()
    if (chainId !== connectedChainId) throw new WrongChainError()

    provider
      .getSigner()
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return provider
          .getSigner()
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            sendAnalyticsEvent(LiquidityEventName.REMOVE_LIQUIDITY_SUBMITTED, {
              source: LiquiditySource.V3,
              label: [liquidityValue0.currency.symbol, liquidityValue1.currency.symbol].join('/'),
              ...trace,
            })
            setTxnHash(response.hash)
            setAttemptingTxn(false)
            // addTransaction(response, {
            //   type: TransactionType.REMOVE_LIQUIDITY_V3,
            //   baseCurrencyId: currencyId(liquidityValue0.currency),
            //   quoteCurrencyId: currencyId(liquidityValue1.currency),
            //   expectedAmountBaseRaw: liquidityValue0.quotient.toString(),
            //   expectedAmountQuoteRaw: liquidityValue1.quotient.toString(),
            // })
            onReload()
          })
      })
      .catch((error) => {
        setAttemptingTxn(false)
        console.error(error)
      })
  }, [
    positionManager,
    liquidityValue0,
    liquidityValue1,
    deadline,
    account,
    chainId,
    positionSDK,
    liquidityPercentage,
    provider,
    tokenId,
    allowedSlippage,
    feeValue0,
    feeValue1,
    trace,
    // addTransaction,
  ])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txnHash) {
      onPercentSelectForSlider(0)
    }
    setAttemptingTxn(false)
    setTxnHash('')
  }, [onPercentSelectForSlider, txnHash])

  const pendingText = (
    <Trans>
      Removing {liquidityValue0?.toSignificant(6)} {liquidityValue0?.currency?.symbol} and{' '}
      {liquidityValue1?.toSignificant(6)} {liquidityValue1?.currency?.symbol}
    </Trans>
  )

  function modalHeader() {
    return (
      <AutoColumn gap="4px" style={{ padding: '16px' }}>
        <RowBetween align="flex-end">
          <Text fontSize={16} fontWeight={535}>
            <Trans>Pooled {liquidityValue0?.currency?.symbol}:</Trans>
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={535} marginLeft="6px">
              {liquidityValue0 && <FormattedCurrencyAmount currencyAmount={liquidityValue0} />}
            </Text>
            {liquidityValue0?.currency ? (
              <div style={{ marginLeft: '8px' }}>
                <CurrencyLogo currency={liquidityValue0?.currency} />
              </div>
            ) : null}
          </RowFixed>
        </RowBetween>
        <RowBetween align="flex-end">
          <Text fontSize={16} fontWeight={535}>
            <Trans>Pooled {liquidityValue1?.currency?.symbol}:</Trans>
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={535} marginLeft="6px">
              {liquidityValue1 && <FormattedCurrencyAmount currencyAmount={liquidityValue1} />}
            </Text>
            {liquidityValue1?.currency ? (
              <div style={{ marginLeft: '8px' }}>
                <CurrencyLogo currency={liquidityValue1?.currency} />
              </div>
            ) : null}
          </RowFixed>
        </RowBetween>
        {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
          <>
            <ThemedText.Body2 fontSize={12} color="primary" textAlign="left" padding="8px 0 0 0">
              <Trans>You will also collect fees earned from this position.</Trans>
            </ThemedText.Body2>
            <RowBetween>
              <Text fontSize={16} fontWeight={535}>
                <Trans>{feeValue0?.currency?.symbol} Fees Earned:</Trans>
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={535} marginLeft="6px">
                  {feeValue0 && <FormattedCurrencyAmount currencyAmount={feeValue0} />}
                </Text>
                {feeValue0?.currency ? (
                  <div style={{ marginLeft: '8px' }}>
                    <CurrencyLogo currency={feeValue0?.currency} />
                  </div>
                ) : null}
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={16} fontWeight={535}>
                <Trans>{feeValue1?.currency?.symbol} Fees Earned:</Trans>
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={535} marginLeft="6px">
                  {feeValue1 && <FormattedCurrencyAmount currencyAmount={feeValue1} />}
                </Text>
                {feeValue1?.currency ? (
                  <div style={{ marginLeft: '8px' }}>
                    <CurrencyLogo currency={feeValue1?.currency} />
                  </div>
                ) : null}
              </RowFixed>
            </RowBetween>
          </>
        ) : null}
        <ButtonPrimary onClick={burn}>
          <Trans>Remove</Trans>
        </ButtonPrimary>
      </AutoColumn>
    )
  }

  const showCollectAsWeth = Boolean(
    liquidityValue0?.currency &&
      liquidityValue1?.currency &&
      (liquidityValue0.currency.isNative ||
        liquidityValue1.currency.isNative ||
        WRAPPED_NATIVE_CURRENCY[liquidityValue0.currency.chainId]?.equals(liquidityValue0.currency.wrapped) ||
        WRAPPED_NATIVE_CURRENCY[liquidityValue1.currency.chainId]?.equals(liquidityValue1.currency.wrapped))
  )
  return (
    <ScrollablePage>
      <AutoColumn>
        {showConfirm ? (
          <Dialog onClose={handleDismissConfirmation} color="container">
            <Header title={<Trans>Confirm Remove Liquidity</Trans>} />
            {modalHeader()}
          </Dialog>
        ) : null}
        {/* <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txnHash ?? ''}
        reviewContent={() => (
          <ConfirmationModalContent
            title={<Trans>Remove liquidity</Trans>}
            onDismiss={handleDismissConfirmation}
            topContent={modalHeader}
          />
        )}
        pendingText={pendingText}
      /> */}
        {/* <AppBody $maxWidth="unset"> */}
        {/* <AddRemoveTabs
        creating={false}
        adding={false}
        positionID={tokenId.toString()}
        autoSlippage={DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE}
      /> */}
        {/* <Wrapper> */}
        {position ? (
          <AutoColumn gap="8px">
            <RowBetween>
              <RowFixed>
                {liquidityValue0?.currency && liquidityValue1?.currency ? (
                  <DoubleCurrencyLogo
                    currency0={liquidityValue0?.currency}
                    currency1={liquidityValue1?.currency}
                    // size={20}
                    // margin={true}
                  />
                ) : null}
                <ThemedText.Subhead2
                  ml="10px"
                  fontSize="20px"
                  id="remove-liquidity-tokens"
                >{`${liquidityValue0?.currency?.symbol}/${liquidityValue1?.currency?.symbol}`}</ThemedText.Subhead2>
              </RowFixed>
              <RangeBadge removed={removed} inRange={!outOfRange} />
            </RowBetween>
            <LightCard>
              <AutoColumn gap="4px">
                <ThemedText.Body1 fontWeight={485}>
                  <Trans>Amount</Trans>
                </ThemedText.Body1>
                <RowBetween gap="4px">
                  <ResponsiveHeaderText>
                    <Trans>{percentForSlider}%</Trans>
                  </ResponsiveHeaderText>
                  <AutoRow gap="2px" justify="flex-end">
                    <SmallMaxButton onClick={() => onPercentSelect(25)} width="20%">
                      <Trans>25%</Trans>
                    </SmallMaxButton>
                    <SmallMaxButton onClick={() => onPercentSelect(50)} width="20%">
                      <Trans>50%</Trans>
                    </SmallMaxButton>
                    <SmallMaxButton onClick={() => onPercentSelect(75)} width="20%">
                      <Trans>75%</Trans>
                    </SmallMaxButton>
                    <SmallMaxButton onClick={() => onPercentSelect(100)} width="20%">
                      <Trans>Max</Trans>
                    </SmallMaxButton>
                  </AutoRow>
                </RowBetween>
                <Slider value={percentForSlider} onChange={onPercentSelectForSlider} />
              </AutoColumn>
            </LightCard>
            <LightCard>
              <AutoColumn gap="4px">
                <RowBetween>
                  <Text fontSize={16} fontWeight={535} id="remove-pooled-tokena-symbol">
                    <Trans>Pooled {liquidityValue0?.currency?.symbol}:</Trans>
                  </Text>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={535} marginLeft="6px">
                      {liquidityValue0 && <FormattedCurrencyAmount currencyAmount={liquidityValue0} />}
                    </Text>
                    {liquidityValue0?.currency ? (
                      <div style={{ marginLeft: '8px' }}>
                        <CurrencyLogo
                          // size="20px"
                          currency={liquidityValue0?.currency}
                        />
                      </div>
                    ) : null}
                  </RowFixed>
                </RowBetween>
                <RowBetween>
                  <Text fontSize={16} fontWeight={535} id="remove-pooled-tokenb-symbol">
                    <Trans>Pooled {liquidityValue1?.currency?.symbol}:</Trans>
                  </Text>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={535} marginLeft="6px">
                      {liquidityValue1 && <FormattedCurrencyAmount currencyAmount={liquidityValue1} />}
                    </Text>
                    {liquidityValue1?.currency ? (
                      <div style={{ marginLeft: '8px' }}>
                        <CurrencyLogo
                          // size="20px"
                          currency={liquidityValue1?.currency}
                        />
                      </div>
                    ) : null}
                  </RowFixed>
                </RowBetween>
                {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
                  <>
                    <Break />
                    <RowBetween>
                      <Text fontSize={16} fontWeight={535}>
                        <Trans>{feeValue0?.currency?.symbol} Fees Earned:</Trans>
                      </Text>
                      <RowFixed>
                        <Text fontSize={16} fontWeight={535} marginLeft="6px">
                          {feeValue0 && <FormattedCurrencyAmount currencyAmount={feeValue0} />}
                        </Text>
                        {feeValue0?.currency ? (
                          <div style={{ marginLeft: '8px' }}>
                            <CurrencyLogo
                              // size="20px"
                              currency={feeValue0?.currency}
                            />
                          </div>
                        ) : null}
                      </RowFixed>
                    </RowBetween>
                    <RowBetween>
                      <Text fontSize={16} fontWeight={535}>
                        <Trans>{feeValue1?.currency?.symbol} Fees Earned:</Trans>
                      </Text>
                      <RowFixed>
                        <Text fontSize={16} fontWeight={535} marginLeft="6px">
                          {feeValue1 && <FormattedCurrencyAmount currencyAmount={feeValue1} />}
                        </Text>
                        {feeValue1?.currency ? (
                          <div style={{ marginLeft: '8px' }}>
                            <CurrencyLogo
                              // size="20px"
                              currency={feeValue1?.currency}
                            />
                          </div>
                        ) : null}
                      </RowFixed>
                    </RowBetween>
                  </>
                ) : null}
              </AutoColumn>
            </LightCard>

            {showCollectAsWeth && (
              <RowBetween>
                <ThemedText.Body1>
                  <Trans>Collect as {nativeWrappedSymbol}</Trans>
                </ThemedText.Body1>
                <Toggle
                  // id="receive-as-weth"
                  checked={receiveWETH}
                  onToggle={() => setReceiveWETH((receiveWETH) => !receiveWETH)}
                />
              </RowBetween>
            )}

            <div style={{ display: 'flex' }}>
              <AutoColumn gap="4px" style={{ flex: '1' }}>
                <ButtonConfirmed
                  confirmed={false}
                  disabled={removed || percent === 0 || !liquidityValue0}
                  onClick={() => setShowConfirm(true)}
                >
                  {removed ? <Trans>Closed</Trans> : error ?? <Trans>Remove</Trans>}
                </ButtonConfirmed>
              </AutoColumn>
            </div>
          </AutoColumn>
        ) : (
          <Loader />
        )}
        {/* </Wrapper> */}
        {/* </AppBody> */}
      </AutoColumn>
    </ScrollablePage>
  )
}
