import 'polyfills'

import { Trans } from '@lingui/macro'
import Wallet from 'components/ConnectWallet'
import HeaderRow from 'components/Header'
import Pool from 'components/Pool'
import Row from 'components/Row'
import Swap, { SwapProps } from 'components/Swap'
import Settings from 'components/Swap/Settings'
import Widget, { WidgetProps } from 'components/Widget'
import { useState } from 'react'
import styled from 'styled-components/macro'

export { getAssetsRepoURI, getNativeLogoURI, Logo, LogoUpdater, useLogo, useLogos } from './components/Logo'
export type { JsonRpcProvider } from '@ethersproject/providers'
export type { Currency } from '@uniswap/sdk-core'
export { TradeType } from '@uniswap/sdk-core'
export type { TokenInfo } from '@uniswap/token-lists'
export type { DialogOptions, DialogWidgetProps } from 'components/Dialog'
export { DialogAnimationType } from 'components/Dialog'
export type { SwapWidgetSkeletonProps } from 'components/Swap/Skeleton'
export { SwapWidgetSkeleton } from 'components/Swap/Skeleton'
export { SupportedChainId } from 'constants/chains'
export type { SupportedLocale } from 'constants/locales'
export { DEFAULT_LOCALE, SUPPORTED_LOCALES } from 'constants/locales'
export type { WidgetPromise } from 'errors'
export { UnknownError, UserRejectedRequestError, WidgetError } from 'errors'
export { RouterPreference } from 'hooks/routing/types'
export type { SwapController } from 'hooks/swap/useSyncController'
export type { FeeOptions } from 'hooks/swap/useSyncConvenienceFee'
export type { DefaultAddress, TokenDefaults } from 'hooks/swap/useSyncTokenDefaults'
export type { OnTxFail, OnTxSubmit, OnTxSuccess, TransactionEventHandlers } from 'hooks/transactions'
export type { Flags } from 'hooks/useSyncFlags'
export type {
  AddEthereumChainParameter,
  OnConnectWalletClick,
  OnError,
  OnSwitchChain,
  WidgetEventHandlers,
} from 'hooks/useSyncWidgetEventHandlers'
export { EMPTY_TOKEN_LIST, UNISWAP_TOKEN_LIST } from 'hooks/useTokenList'
export { validateTokenList, validateTokens } from 'hooks/useTokenList/validateTokenList'
export type { JsonRpcConnectionMap } from 'hooks/web3/useJsonRpcUrlsMap'
export type {
  OnAmountChange,
  OnExpandSwapDetails,
  OnInitialSwapQuote,
  OnPermit2Allowance,
  OnReviewSwapClick,
  OnRouterPreferenceChange,
  OnSettingsReset,
  OnSlippageChange,
  OnSubmitSwapClick,
  OnSwapApprove,
  OnSwapPriceUpdateAck,
  OnSwapQuote,
  OnSwapSend,
  OnSwitchTokens,
  OnTokenAllowance,
  OnTokenChange,
  OnTokenSelectorClick,
  OnTransactionDeadlineChange,
  OnWrapSend,
  SwapEventHandlers,
  SwapPerfEventHandlers,
  SwapSettingsEventHandlers,
} from 'state/swap'
export { Field } from 'state/swap'
export type { Slippage } from 'state/swap/settings'
export type {
  ApprovalTransactionInfo,
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  SwapTransactionInfo,
  Transaction,
  TransactionInfo,
  UnwrapTransactionInfo,
  WrapTransactionInfo,
} from 'state/transactions'
export { TransactionType } from 'state/transactions'
export type { Theme } from 'theme'
export { darkTheme, defaultTheme, lightTheme } from 'theme'
export { invertTradeType, toTradeType } from 'utils/tradeType'

const TabButton = styled.div<{ isActive?: boolean }>`
  border-bottom: solid 2px ${({ theme, isActive }) => (isActive ? theme.outline : 'transparent')};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.xsmall}rem;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.xsmall}rem;
  cursor: pointer;
  overflow: hidden;
  padding: 8px;

  :hover {
    background-color: ${({ theme }) => theme.interactive};
  }
`

export type SwapWidgetProps = SwapProps & WidgetProps

export function SwapWidget(props: SwapWidgetProps) {
  const [tabIndex, setTabIndex] = useState(0)

  const handleTab = (value = 0) => {
    setTabIndex(value)
  }

  const renderWidgets = [
    { label: 'Swap', content: <Swap {...props} /> },
    { label: 'Pool', content: <Pool /> },
  ]

  return (
    <Widget {...props}>
      <HeaderRow>
        <Row gap={0.5} data-testid="header-title">
          {renderWidgets.map((item, itemIndex) => {
            return (
              <TabButton key={itemIndex} onClick={() => handleTab(itemIndex)} isActive={tabIndex === itemIndex}>
                <Trans>{item.label}</Trans>
              </TabButton>
            )
          })}
        </Row>
        <Row gap={1} data-testid="header-children" style={{ paddingBottom: 8 }}>
          <Wallet disabled={props.hideConnectionUI} />
          <Settings />
        </Row>
      </HeaderRow>
      {renderWidgets?.[tabIndex]?.content ?? null}
    </Widget>
  )
}
