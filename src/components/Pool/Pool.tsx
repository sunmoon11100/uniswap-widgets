import { Trans } from '@lingui/macro'
import { BrowserEvent, InterfaceElementName, InterfaceEventName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { TraceEvent } from 'analytics'
import AddLiquidity from 'components/AddLiquidity'
import Button, { ButtonPrimary } from 'components/Button'
import Column from 'components/Column'
import ModuleContainer from 'components/container/module'
import Dialog, { Header } from 'components/Dialog'
import PositionList from 'components/PositionList'
import Row from 'components/Row'
import ConnectWalletButton from 'components/Swap/SwapActionButton/ConnectWalletButton'
import { SwapInfoProvider } from 'hooks/swap/useSwapInfo'
import { useV3Positions } from 'hooks/useV3Positions'
import { Inbox } from 'icons'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { PositionDetails } from 'types/position'
import { supportedChainId } from 'utils/supportedChainId'

const MainContentWrapper = styled.main`
  background-color: ${({ theme }) => theme.container};
  border: 1px solid ${({ theme }) => theme.container};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
`

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`

const IconStyle = css`
  height: 48px;
  margin-bottom: 0.5rem;
  width: 48px;
`

const InboxIcon = styled(Inbox)`
  ${IconStyle}
`

function PositionsLoadingPlaceholder() {
  return (
    <>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </>
  )
}

function WrongNetworkCard() {
  return (
    <>
      <Trans>Your connected network is unsupported.</Trans>
    </>
  )
}

const StyledTokenButton = styled(Button)`
  border-radius: ${({ theme }) => theme.borderRadius.medium}rem;
  min-height: 2rem;
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
`

export default function Pool() {
  const { account, chainId, isActive } = useWeb3React()

  const [isOpen, setIsOpen] = useState(false)

  const { positions, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const userSelectedPositionSet = useMemo(
    () => [...openPositions, ...closedPositions],
    [closedPositions, openPositions]
  )

  if (!supportedChainId(chainId)) {
    return <WrongNetworkCard />
  }

  const showConnectAWallet = Boolean(!account)

  const handleAdd = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSaved = () => {
    handleClose()
  }

  const handleReload = () => {}

  return (
    <ModuleContainer style={{ padding: 16 }}>
      {isOpen ? (
        <Dialog color="module" onClose={handleClose}>
          <Header title={<Trans>Add Liquidity</Trans>} />
          <AddLiquidity onClose={handleClose} />
        </Dialog>
      ) : null}

      <Column gap={1.5}>
        <Row justify="flex-end">
          <ButtonPrimary padding="8px 16px" $borderRadius="1rem" onClick={handleAdd}>
            <Trans>Add Liquidity</Trans>
          </ButtonPrimary>
        </Row>
        <MainContentWrapper>
          {positionsLoading ? (
            <PositionsLoadingPlaceholder />
          ) : userSelectedPositionSet && closedPositions && userSelectedPositionSet.length > 0 ? (
            <PositionList
              positions={userSelectedPositionSet}
              setUserHideClosedPositions={() => {
                return
              }}
              userHideClosedPositions={false}
              onReload={handleReload}
            />
          ) : (
            <ErrorContainer>
              <ThemedText.Body1 color="primary" textAlign="center">
                <InboxIcon strokeWidth={1} style={{ marginTop: '2em' }} />
                <div>
                  <Trans>Your active liquidity positions will appear here.</Trans>
                </div>
              </ThemedText.Body1>
              {showConnectAWallet && (
                <TraceEvent
                  events={[BrowserEvent.onClick]}
                  name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
                  properties={{ received_swap_quote: false }}
                  element={InterfaceElementName.CONNECT_WALLET_BUTTON}
                >
                  <ConnectWalletButton />
                </TraceEvent>
              )}
            </ErrorContainer>
          )}
        </MainContentWrapper>
      </Column>
    </ModuleContainer>
  )
}
