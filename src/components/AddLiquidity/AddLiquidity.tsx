import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { useTrace } from '@uniswap/analytics'
import { BrowserEvent, InterfaceElementName, InterfaceEventName, LiquidityEventName } from '@uniswap/analytics-events'
import { Currency, CurrencyAmount, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, Percent } from '@uniswap/sdk-core'
import { FeeAmount, NonfungiblePositionManager } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import { TraceEvent, sendAnalyticsEvent } from 'analytics'
import Button from 'components/Button'
import { BlueCard, OutlineCard, YellowCard } from 'components/Card'
import Column, { AutoColumn } from 'components/Column'
import FeeSelector from 'components/FeeSelector'
import HoverInlineText from 'components/HoverInlineText'
import PositionPageUnsupportedContent from 'components/Pool/PositionPageUnsupportedContent'
import { PositionPreview } from 'components/PositionPreview'
import RangeSelector from 'components/RangeSelector'
import PresetsButtons from 'components/RangeSelector/PresetsButtons'
import RateToggle from 'components/RateToggle'
import Row, { AutoRow, RowBetween, RowFixed } from 'components/Row'
import ConnectWalletButton from 'components/Swap/SwapActionButton/ConnectWalletButton'
import Dots from 'components/dots'
import ScrollablePage from 'components/scrollable-page'
import { isSupportedChainId } from 'constants/chainInfo'
import { WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { useSingleCallResult } from 'hooks/multicall'
import { useIsPendingApproval } from 'hooks/transactions'
import { ApprovalState, useApproval } from 'hooks/useApproval'
import { useArgentWalletContract } from 'hooks/useArgentWalletContract'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import useCurrency from 'hooks/useCurrency'
import { useDerivedPositionInfo } from 'hooks/useDerivedPositionInfo'
import { DEFAULT_SLIPPAGE } from 'hooks/useSlippage'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useV3PositionFromTokenId } from 'hooks/useV3Positions'
import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { Bound, Field } from 'state/mint/v3/actions'
import {
  useRangeHopCallbacks,
  useV3DerivedMintInfo,
  useV3MintActionHandlers,
  useV3MintState,
} from 'state/mint/v3/hooks'
import { TransactionInfo, TransactionType } from 'state/transactions'
import styled from 'styled-components'
import { useTheme } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { addressesAreEquivalent } from 'utils/addressesAreEquivalent'
import approveAmountCalldata from 'utils/approveAmountCalldata'
import { calculateGasMargin } from 'utils/calculateGasMargin'
import { currencyId } from 'utils/currencyId'
import { WrongChainError } from 'utils/errors'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import CurrencyInputPanel from './CurrencyInputPanel'
import OwnershipWarning from './OwnershipWarning'
import UnsupportedCurrencyFooter from './UnsupportedCurrencyFooter'
import { DynamicSection, StyledInput } from './styled'

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

interface BodyWrapperProps {
  $margin?: string
  $maxWidth?: string
}

export const BodyWrapper = styled.main<BodyWrapperProps>`
  position: relative;
  margin-top: ${({ $margin }) => $margin ?? '0px'};
  max-width: ${({ $maxWidth }) => $maxWidth ?? '420px'};
  width: 100%;
  background: ${({ theme }) => theme.container};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.outline};
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
`
// z-index: ${Z_INDEX.default};

const StyledBodyWrapper = styled(BodyWrapper)<{ $hasExistingPosition: boolean }>`
  padding: ${({ $hasExistingPosition }) => ($hasExistingPosition ? '10px' : 0)};
  max-width: 640px;
`

interface AddLiquidityProps {
  currencyIdA?: string
  currencyIdB?: string
  feeAmount?: string
  tokenId?: string
  onClose?: () => void
}

export default function AddLiquidityWrapper({
  currencyIdA,
  currencyIdB,
  feeAmount,
  tokenId,
  onClose = () => null,
}: AddLiquidityProps = {}) {
  const { chainId } = useWeb3React()
  if (isSupportedChainId(chainId)) {
    return <AddLiquidity currencyIdA={currencyIdA} currencyIdB={currencyIdB} feeAmount={feeAmount} tokenId={tokenId} />
  } else {
    return <PositionPageUnsupportedContent onClose={onClose} />
  }
}

function AddLiquidity({
  currencyIdA: propsCurrentIdA,
  currencyIdB: propsCurrentIdB,
  feeAmount: propsFeeAmount,
  tokenId,
  onClose = () => null,
}: AddLiquidityProps) {
  const { account, chainId, provider } = useWeb3React()
  const theme = useTheme()
  const trace = useTrace()

  const positionManager = useV3NFTPositionManagerContract()

  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined
  )
  const hasExistingPosition = !!existingPositionDetails && !positionLoading
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

  // fee selection from url

  const [currencyIdA, setCurrencyIdA] = useState(propsCurrentIdA)
  const [currencyIdB, setCurrencyIdB] = useState(propsCurrentIdB)
  const [feeAmount, setFeeAmount] = useState<FeeAmount | undefined>()

  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  // mint state
  const { independentField, typedValue, startPriceTypedValue } = useV3MintState()

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition
  )

  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useV3MintActionHandlers(noLiquidity)

  const isValid = !errorMessage && !invalidRange

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  const argentWalletContract = useArgentWalletContract()

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproval(
    argentWalletContract ? undefined : parsedAmounts[Field.CURRENCY_A],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined,
    useIsPendingApproval
  )
  const [approvalB, approveBCallback] = useApproval(
    argentWalletContract ? undefined : parsedAmounts[Field.CURRENCY_B],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined,
    useIsPendingApproval
  )

  const allowedSlippage = DEFAULT_SLIPPAGE.allowed

  async function onAdd() {
    if (!chainId || !provider || !account) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } =
        hasExistingPosition && tokenId
          ? NonfungiblePositionManager.addCallParameters(position, {
              tokenId,
              slippageTolerance: allowedSlippage,
              deadline: deadline.toString(),
              useNative,
            })
          : NonfungiblePositionManager.addCallParameters(position, {
              slippageTolerance: allowedSlippage,
              recipient: account,
              deadline: deadline.toString(),
              useNative,
              createPool: noLiquidity,
            })

      let txn: { to: string; data: string; value: string } = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        data: calldata,
        value,
      }

      if (argentWalletContract) {
        const amountA = parsedAmounts[Field.CURRENCY_A]
        const amountB = parsedAmounts[Field.CURRENCY_B]
        const batch = [
          ...(amountA && amountA.currency.isToken
            ? [approveAmountCalldata(amountA, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId])]
            : []),
          ...(amountB && amountB.currency.isToken
            ? [approveAmountCalldata(amountB, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId])]
            : []),
          {
            to: txn.to,
            data: txn.data,
            value: txn.value,
          },
        ]
        const data = argentWalletContract.interface.encodeFunctionData('wc_multiCall', [batch])
        txn = {
          to: argentWalletContract.address,
          data,
          value: '0x0',
        }
      }

      const connectedChainId = await provider.getSigner().getChainId()
      if (chainId !== connectedChainId) throw new WrongChainError()

      setAttemptingTxn(true)

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
              setAttemptingTxn(false)
              const transactionInfo: TransactionInfo = {
                type: TransactionType.ADD_LIQUIDITY_V3_POOL,
                baseCurrencyId: currencyId(baseCurrency),
                quoteCurrencyId: currencyId(quoteCurrency),
                createPool: Boolean(noLiquidity),
                expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
                expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
                feeAmount: position.pool.fee,
              }
              setTxHash(response.hash)
              sendAnalyticsEvent(LiquidityEventName.ADD_LIQUIDITY_SUBMITTED, {
                label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
                ...trace,
                ...transactionInfo,
              })

              onClose()
            })
        })
        .catch((error) => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    } else {
      return
    }
  }

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      } else {
        // prevent weth + eth
        const isETHOrWETHNew =
          currencyIdNew === 'ETH' ||
          (chainId !== undefined && currencyIdNew === WRAPPED_NATIVE_CURRENCY[chainId]?.address)
        const isETHOrWETHOther =
          currencyIdOther !== undefined &&
          (currencyIdOther === 'ETH' ||
            (chainId !== undefined && currencyIdOther === WRAPPED_NATIVE_CURRENCY[chainId]?.address))

        if (isETHOrWETHNew && isETHOrWETHOther) {
          return [currencyIdNew, undefined]
        } else {
          return [currencyIdNew, currencyIdOther]
        }
      }
    },
    [chainId]
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        // navigate(`/add/${idA}`)
        setCurrencyIdA(idA)
      } else {
        // navigate(`/add/${idA}/${idB}`)
        setCurrencyIdA(idA)
        setCurrencyIdB(idB)
      }
    },
    [handleCurrencySelect, currencyIdB]
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        // navigate(`/add/${idB}`)
        setCurrencyIdB(idB)
      } else {
        // navigate(`/add/${idA}/${idB}`)
        setCurrencyIdA(idA)
        setCurrencyIdB(idB)
      }
    },
    [handleCurrencySelect, currencyIdA]
  )

  const handleFeePoolSelect = useCallback(
    (newFeeAmount: FeeAmount) => {
      onLeftRangeInput('')
      onRightRangeInput('')
      // navigate(`/add/${currencyIdA}/${currencyIdB}/${newFeeAmount}`)
      setFeeAmount(newFeeAmount)
    },
    [currencyIdA, currencyIdB, onLeftRangeInput, onRightRangeInput]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      // dont jump to pool page if creating
      // navigate('/pools')
      onClose()
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const addIsUnsupported = false

  const clearAll = useCallback(() => {
    onFieldAInput('')
    onFieldBInput('')
    onLeftRangeInput('')
    onRightRangeInput('')
    // navigate(`/add`)
    setCurrencyIdA('')
    setCurrencyIdB('')
    setFeeAmount(undefined)
  }, [onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput])

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool)

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA =
    !argentWalletContract && approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB =
    !argentWalletContract && approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const pendingText = `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) : ''} ${
    !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''
  } ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) : ''} ${
    !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''
  }`

  const handleSetFullRange = useCallback(() => {
    getSetFullRange()

    const minPrice = pricesAtLimit[Bound.LOWER]
    if (minPrice) onLeftRangeInput(minPrice.toSignificant(5))
    const maxPrice = pricesAtLimit[Bound.UPPER]
    if (maxPrice) onRightRangeInput(maxPrice.toSignificant(5))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSetFullRange, pricesAtLimit])

  useEffect(() => {
    setCurrencyIdA(propsCurrentIdA)
  }, [propsCurrentIdA])

  useEffect(() => {
    setCurrencyIdB(propsCurrentIdB)
  }, [propsCurrentIdB])

  useEffect(() => {
    setFeeAmount(
      propsFeeAmount && Object.values(FeeAmount).includes(parseFloat(propsFeeAmount))
        ? parseFloat(propsFeeAmount)
        : undefined
    )
  }, [propsFeeAmount])

  const Buttons = () =>
    addIsUnsupported ? (
      <Button disabled={true} style={{ borderRadius: 12, padding: 12 }}>
        <ThemedText.ButtonMedium mb="4px">
          <Trans>Unsupported Asset</Trans>
        </ThemedText.ButtonMedium>
      </Button>
    ) : !account ? (
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
        properties={{ received_swap_quote: false }}
        element={InterfaceElementName.CONNECT_WALLET_BUTTON}
      >
        <ConnectWalletButton />
      </TraceEvent>
    ) : (
      <Column gap={8}>
        {(approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING) &&
          isValid && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {showApprovalA && (
                <Button
                  color="primary"
                  onClick={approveACallback}
                  disabled={approvalA === ApprovalState.PENDING}
                  // width={showApprovalB ? '48%' : '100%'}
                >
                  {approvalA === ApprovalState.PENDING ? (
                    <Dots>
                      <Trans>Approving {currencies[Field.CURRENCY_A]?.symbol}</Trans>
                    </Dots>
                  ) : (
                    <Trans>Approve {currencies[Field.CURRENCY_A]?.symbol}</Trans>
                  )}
                </Button>
              )}
              {showApprovalB && (
                <Button
                  color="primary"
                  onClick={approveBCallback}
                  disabled={approvalB === ApprovalState.PENDING}
                  // width={showApprovalA ? '48%' : '100%'}
                >
                  {approvalB === ApprovalState.PENDING ? (
                    <Dots>
                      <Trans>Approving {currencies[Field.CURRENCY_B]?.symbol}</Trans>
                    </Dots>
                  ) : (
                    <Trans>Approve {currencies[Field.CURRENCY_B]?.symbol}</Trans>
                  )}
                </Button>
              )}
            </div>
          )}
        <Button
          color={
            !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'error' : 'accent'
          }
          onClick={() => {
            // setShowConfirm(true)
            onAdd()
          }}
          disabled={
            !isValid ||
            (!argentWalletContract && approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
            (!argentWalletContract && approvalB !== ApprovalState.APPROVED && !depositBDisabled)
          }
          padding="12px"
        >
          <ThemedText.Body1 fontWeight={535}>{errorMessage ? errorMessage : <Trans>Add</Trans>}</ThemedText.Body1>
        </Button>
      </Column>
    )

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
  const ownsNFT =
    addressesAreEquivalent(owner, account) || addressesAreEquivalent(existingPositionDetails?.operator, account)
  const showOwnershipWarning = Boolean(hasExistingPosition && account && !ownsNFT)

  return (
    <>
      <ScrollablePage>
        {/* <TransactionConfirmationModal
          isOpen={showConfirm}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          reviewContent={() => (
            <ConfirmationModalContent
              title={<Trans>Add Liquidity</Trans>}
              onDismiss={handleDismissConfirmation}
              topContent={() => (
                <Review
                  parsedAmounts={parsedAmounts}
                  position={position}
                  existingPosition={existingPosition}
                  priceLower={priceLower}
                  priceUpper={priceUpper}
                  outOfRange={outOfRange}
                  ticksAtLimit={ticksAtLimit}
                />
              )}
              bottomContent={() => (
                <ButtonPrimary style={{ marginTop: '1rem' }} onClick={onAdd}>
                  <Text fontWeight={535} fontSize={20}>
                    <Trans>Add</Trans>
                  </Text>
                </ButtonPrimary>
              )}
            />
          )}
          pendingText={pendingText}
        /> */}
        {/* <StyledBodyWrapper $hasExistingPosition={hasExistingPosition}> */}
        {/* <AddRemoveTabs
            creating={false}
            adding={true}
            positionID={tokenId}
            autoSlippage={DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE}
            showBackLink={!hasExistingPosition}
          > */}
        {/* </AddRemoveTabs> */}
        {/* <Wrapper> */}
        {/* <ResponsiveTwoColumns wide={!hasExistingPosition}> */}
        <AutoColumn gap="16px">
          {!hasExistingPosition && (
            <>
              <AutoColumn gap="8px">
                <RowBetween>
                  <ThemedText.Subhead1>
                    <Trans>Select pair</Trans>
                  </ThemedText.Subhead1>
                  {!hasExistingPosition && (
                    <Row justifyContent="flex-end" style={{ width: 'fit-content', minWidth: 'fit-content' }}>
                      <Button onClick={clearAll} padding="2px">
                        <ThemedText.Caption fontSize="12px">
                          <Trans>Clear all</Trans>
                        </ThemedText.Caption>
                      </Button>
                    </Row>
                  )}
                </RowBetween>

                <Row gap="4px">
                  <CurrencyInputPanel
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onUserInput={onFieldAInput}
                    hideInput
                    onMax={() => {
                      onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                    }}
                    onCurrencySelect={handleCurrencyASelect}
                    showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                    currency={currencies[Field.CURRENCY_A]}
                    // id="add-liquidity-input-tokena"
                    showCommonBases
                  />

                  <CurrencyInputPanel
                    value={formattedAmounts[Field.CURRENCY_B]}
                    hideInput
                    onUserInput={onFieldBInput}
                    onCurrencySelect={handleCurrencyBSelect}
                    onMax={() => {
                      onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                    }}
                    showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                    currency={currencies[Field.CURRENCY_B]}
                    // id="add-liquidity-input-tokenb"
                    showCommonBases
                  />
                </Row>

                <FeeSelector
                  disabled={!quoteCurrency || !baseCurrency}
                  feeAmount={feeAmount}
                  handleFeePoolSelect={handleFeePoolSelect}
                  currencyA={baseCurrency ?? undefined}
                  currencyB={quoteCurrency ?? undefined}
                />
              </AutoColumn>
            </>
          )}
          {hasExistingPosition && existingPosition && (
            <PositionPreview
              position={existingPosition}
              title={<Trans>Selected range</Trans>}
              inRange={!outOfRange}
              ticksAtLimit={ticksAtLimit}
            />
          )}
          {!hasExistingPosition && (
            <>
              <DynamicSection gap="8px" disabled={!feeAmount || invalidPool}>
                <RowBetween>
                  <ThemedText.Body1>
                    <Trans>Set price range</Trans>
                  </ThemedText.Body1>

                  {Boolean(baseCurrency && quoteCurrency) && (
                    <AutoRow gap="4px">
                      <PresetsButtons onSetFullRange={handleSetFullRange} />
                      <RateToggle
                        currencyA={baseCurrency as Currency}
                        currencyB={quoteCurrency as Currency}
                        handleRateToggle={() => {
                          if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
                            onLeftRangeInput((invertPrice ? priceLower : priceUpper?.invert())?.toSignificant(6) ?? '')
                            onRightRangeInput((invertPrice ? priceUpper : priceLower?.invert())?.toSignificant(6) ?? '')
                            onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '')
                          }
                          // navigate(
                          //   `/add/${currencyIdB as string}/${currencyIdA as string}${
                          //     feeAmount ? '/' + feeAmount : ''
                          //   }`
                          // )

                          setCurrencyIdA(currencyIdB)
                          setCurrencyIdB(currencyIdA)
                        }}
                      />
                    </AutoRow>
                  )}
                </RowBetween>

                <RangeSelector
                  priceLower={priceLower}
                  priceUpper={priceUpper}
                  getDecrementLower={getDecrementLower}
                  getIncrementLower={getIncrementLower}
                  getDecrementUpper={getDecrementUpper}
                  getIncrementUpper={getIncrementUpper}
                  onLeftRangeInput={onLeftRangeInput}
                  onRightRangeInput={onRightRangeInput}
                  currencyA={baseCurrency}
                  currencyB={quoteCurrency}
                  feeAmount={feeAmount}
                  ticksAtLimit={ticksAtLimit}
                />

                {outOfRange && (
                  <YellowCard padding="8px 12px" $borderRadius="12px">
                    <RowBetween>
                      <AlertTriangle stroke={theme.warning} size="16px" />
                      <ThemedText.Body1 ml="12px" fontSize="12px">
                        <Trans>
                          Your position will not earn fees or be used in trades until the market price moves into your
                          range.
                        </Trans>
                      </ThemedText.Body1>
                    </RowBetween>
                  </YellowCard>
                )}

                {invalidRange && (
                  <YellowCard padding="8px 12px" $borderRadius="12px">
                    <RowBetween>
                      <AlertTriangle stroke={theme.warning} size="16px" />
                      <ThemedText.Body1 ml="12px" fontSize="12px">
                        <Trans>Invalid range selected. The min price must be lower than the max price.</Trans>
                      </ThemedText.Body1>
                    </RowBetween>
                  </YellowCard>
                )}
              </DynamicSection>

              <DynamicSection gap="4px" disabled={!feeAmount || invalidPool}>
                {!noLiquidity ? (
                  <>
                    {Boolean(price && baseCurrency && quoteCurrency && !noLiquidity) && (
                      <AutoColumn gap="2px" style={{ marginTop: '0.5rem' }}>
                        <Trans>
                          <ThemedText.Body1 fontWeight={535} fontSize={12} color="primary">
                            Current price:
                          </ThemedText.Body1>
                          <ThemedText.Body2 fontWeight={535} fontSize={20} color="primary">
                            {price && (
                              <HoverInlineText
                                maxCharacters={20}
                                text={invertPrice ? price.invert().toSignificant(6) : price.toSignificant(6)}
                              />
                            )}
                          </ThemedText.Body2>
                          {baseCurrency && (
                            <ThemedText.Body2 color="primary" fontSize={12}>
                              {quoteCurrency?.symbol} per {baseCurrency.symbol}
                            </ThemedText.Body2>
                          )}
                        </Trans>
                      </AutoColumn>
                    )}
                    {/* <LiquidityChartRangeInput
                            currencyA={baseCurrency ?? undefined}
                            currencyB={quoteCurrency ?? undefined}
                            feeAmount={feeAmount}
                            ticksAtLimit={ticksAtLimit}
                            price={
                              price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined
                            }
                            priceLower={priceLower}
                            priceUpper={priceUpper}
                            onLeftRangeInput={onLeftRangeInput}
                            onRightRangeInput={onRightRangeInput}
                            interactive={!hasExistingPosition}
                          /> */}
                  </>
                ) : (
                  <AutoColumn gap="4px">
                    {noLiquidity && (
                      <BlueCard
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '1rem 1rem',
                        }}
                      >
                        <ThemedText.Body2 fontSize={14} style={{ fontWeight: 535 }} textAlign="left" color="accent">
                          <Trans>
                            This pool must be initialized before you can add liquidity. To initialize, select a starting
                            price for the pool. Then, enter your liquidity price range and deposit amount. Gas fees will
                            be higher than usual due to the initialization transaction.
                          </Trans>
                        </ThemedText.Body2>
                      </BlueCard>
                    )}
                    <OutlineCard padding="12px">
                      <StyledInput
                        className="start-price-input"
                        value={startPriceTypedValue}
                        onUserInput={onStartPriceInput}
                      />
                    </OutlineCard>
                    <RowBetween
                      style={{
                        backgroundColor: theme.container,
                        padding: '12px',
                        borderRadius: '12px',
                      }}
                    >
                      <ThemedText.Body1>
                        <Trans>Starting {baseCurrency?.symbol} Price:</Trans>
                      </ThemedText.Body1>
                      <ThemedText.Body1>
                        {price ? (
                          <ThemedText.Body1>
                            <RowFixed>
                              <HoverInlineText
                                maxCharacters={20}
                                text={invertPrice ? price?.invert()?.toSignificant(8) : price?.toSignificant(8)}
                              />{' '}
                              <span style={{ marginLeft: '4px' }}>
                                {quoteCurrency?.symbol} per {baseCurrency?.symbol}
                              </span>
                            </RowFixed>
                          </ThemedText.Body1>
                        ) : (
                          '-'
                        )}
                      </ThemedText.Body1>
                    </RowBetween>
                  </AutoColumn>
                )}
              </DynamicSection>
            </>
          )}
          <div>
            <DynamicSection disabled={invalidPool || invalidRange || (noLiquidity && !startPriceTypedValue)}>
              <AutoColumn gap="md">
                <ThemedText.Body1>
                  {hasExistingPosition ? <Trans>Add more liquidity</Trans> : <Trans>Deposit amounts</Trans>}
                </ThemedText.Body1>

                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  // id="add-liquidity-input-tokena"
                  // fiatValue={currencyAFiat}
                  showCommonBases
                  // locked={depositADisabled}
                  disabledCurrency={true}
                />

                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  onMax={() => {
                    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                  currency={currencies[Field.CURRENCY_B]}
                  // id="add-liquidity-input-tokenb"
                  // fiatValue={currencyBFiat}
                  showCommonBases
                  // locked={depositBDisabled}
                  disabledCurrency={true}
                />
              </AutoColumn>
            </DynamicSection>
          </div>
          <Buttons />
        </AutoColumn>

        {/* </ResponsiveTwoColumns> */}
        {/* </Wrapper> */}
        {/* </StyledBodyWrapper> */}
        {showOwnershipWarning && <OwnershipWarning ownerAddress={owner} />}
        {addIsUnsupported && (
          <UnsupportedCurrencyFooter
            show={addIsUnsupported}
            currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
          />
        )}
      </ScrollablePage>
      {/* <SwitchLocaleLink /> */}
    </>
  )
  // const handleSave = async () => {
  //   if (isTokensSelected) {
  //     const provider = new JsonRpcProvider()
  //
  //     const token0 = tokenA.isNative ? WETH9[1] : tokenA
  //     const token1 = tokenB.isNative ? WETH9[1] : tokenB
  //
  //     // // approval token addresses
  //     // const token0Approval = await getTokenTransferApproval(token0Address, amount0, chainId)
  //     // const token1Approval = await getTokenTransferApproval(token1Address, amount1, chainId)
  //
  //     const currentPoolAddress = computePoolAddress({
  //       factoryAddress: FACTORY_ADDRESS,
  //       tokenA: token0,
  //       tokenB: token1,
  //       fee,
  //     })
  //
  //     const poolContract = new Contract(currentPoolAddress, IUniswapV3PoolABI.abi, provider)
  //
  //     const [liquidity, slot0] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])
  //
  //     const configuredPool = new Pool(
  //       token0,
  //       token1,
  //       fee,
  //       slot0.sqrtPriceX96.toString(),
  //       liquidity.toString(),
  //       slot0.tick
  //     )
  //
  //     const position = Position.fromAmounts({
  //       pool: configuredPool,
  //       tickLower:
  //         nearestUsableTick(configuredPool.tickCurrent, configuredPool.tickSpacing) - configuredPool.tickSpacing * 2,
  //       tickUpper:
  //         nearestUsableTick(configuredPool.tickCurrent, configuredPool.tickSpacing) + configuredPool.tickSpacing * 2,
  //       amount0: JSBI.BigInt(amountA ?? ''),
  //       amount1: JSBI.BigInt(amountB ?? ''),
  //       useFullPrecision: true,
  //     })
  //
  //     const mintOptions: MintOptions = {
  //       recipient: account ?? '',
  //       deadline: Math.floor(Date.now() / 1000) + 60 * 20,
  //       slippageTolerance: new Percent(50, 10_000),
  //     }
  //
  //     // get calldata for minting a position
  //     const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, mintOptions)
  //
  //     const transaction = {
  //       data: calldata,
  //       to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  //       value,
  //       from: account,
  //       maxFeePerGas: MAX_FEE_PER_GAS,
  //       maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  //     }
  //
  //     const signer = provider.getSigner()
  //
  //     const tx = await signer.sendTransaction(transaction)
  //
  //     onMint(tx)
  //   }
  // }

  // return (
  //   <ScrollContainer>
  //     <Column gap={1}>
  //       <ThemedText.Body1>
  //         <Trans>Select pair</Trans>
  //       </ThemedText.Body1>
  //
  //       <Column gap={0.5} flex align="stretch">
  //         <SelectToken value={tokenA} onChange={setTokenA} />
  //         <SelectToken value={tokenB} onChange={setTokenB} />
  //       </Column>
  //
  //       {isTokensSelected ? (
  //         <>
  //           <FeeSelect value={fee} onChange={setFee} />
  //
  //           <PriceRange />
  //
  //           <DepositInput />
  //
  //           {!account || !isActive ? <ConnectWalletButton /> : <StyledTokenButton onClick={handleSave} />}
  //         </>
  //       ) : null}
  //     </Column>
  //   </ScrollContainer>
  // )
}
