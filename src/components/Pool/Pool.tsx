import { Trans } from '@lingui/macro'
import { BrowserEvent, InterfaceElementName, InterfaceEventName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { TraceEvent } from 'analytics'
import AddLiquidity from 'components/AddLiquidity'
import Button from 'components/Button'
import Column from 'components/Column'
import ModuleContainer from 'components/container/module'
import Dialog, { Header } from 'components/Dialog'
import PositionList from 'components/PositionList'
import Row from 'components/Row'
import ConnectWalletButton from 'components/Swap/SwapActionButton/ConnectWalletButton'
import { useV3Positions } from 'hooks/useV3Positions'
import { Inbox } from 'icons'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { PositionDetails } from 'types/position'
import { supportedChainId } from 'utils/supportedChainId'

const MainContentWrapper = styled.main`
  align-items: stretch;
  background-color: ${({ theme }) => theme.container};
  border: 1px solid ${({ theme }) => theme.container};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  padding: 0;
`

const ErrorContainer = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
  padding-bottom: 8px;
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
    <Row justify="center" pad={1}>
      <ThemedText.Subhead1>
        <Trans>Loading</Trans>...
      </ThemedText.Subhead1>
    </Row>
  )
}

function WrongNetworkCard() {
  return (
    <>
      <Trans>Your connected network is unsupported.</Trans>
    </>
  )
}

const AddLiquidityButton = styled(Button)`
  background-color: ${({ theme }) => theme.accent};
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  width: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.accentSoft};
  }
`

export default function Pool() {
  const { account, chainId, isActive } = useWeb3React()

  const [isOpen, setIsOpen] = useState(false)
  const [userHideClosedPositions, setUserHideClosedPositions] = useState(false)

  const { positions, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const userSelectedPositionSet = useMemo(
    () => [...openPositions, ...(userHideClosedPositions ? [] : closedPositions)],
    [closedPositions, openPositions, userHideClosedPositions]
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
          <AddLiquidityButton padding="12px" onClick={handleAdd}>
            <ThemedText.Body1>
              + <Trans>Add Liquidity</Trans>
            </ThemedText.Body1>
          </AddLiquidityButton>
        </Row>
        <MainContentWrapper>
          {positionsLoading ? (
            <PositionsLoadingPlaceholder />
          ) : userSelectedPositionSet && closedPositions && userSelectedPositionSet.length > 0 ? (
            <PositionList
              positions={userSelectedPositionSet}
              setUserHideClosedPositions={setUserHideClosedPositions}
              userHideClosedPositions={userHideClosedPositions}
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
