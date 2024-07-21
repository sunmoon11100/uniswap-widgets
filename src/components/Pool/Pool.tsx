import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import AddLiquidity from 'components/AddLiquidity'
import Column from 'components/Column'
import Dialog, { Header } from 'components/Dialog'
import Row from 'components/Row'
import ConnectWalletButton from 'components/Swap/SwapActionButton/ConnectWalletButton'
import { StyledTokenButton } from 'components/TokenSelect/TokenButton'
import MainContainer from 'components/container/main'
import ModuleContainer from 'components/container/module'
import { ethers } from 'ethers'
import { SwapInfoProvider } from 'hooks/swap/useSwapInfo'
import { useV3Positions } from 'hooks/useV3Positions'
import { Inbox, LargeIcon } from 'icons'
import { useState } from 'react'
import { ThemedText } from 'theme'

export default function Pool() {
  const { account, isActive } = useWeb3React()

  const [isOpen, setIsOpen] = useState(false)

  const { positions, loading: positionsLoading } = useV3Positions(account)

  console.log(positions)

  const handleAdd = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSaved = (v: ethers.providers.TransactionResponse) => {
    handleClose()
  }

  return (
    <ModuleContainer style={{ padding: 16 }}>
      {isOpen ? (
        <Dialog color="module" onClose={handleClose}>
          <Header title={<Trans>Add Liquidity</Trans>} />
          <SwapInfoProvider>
            <AddLiquidity onMint={handleSaved} />
          </SwapInfoProvider>
        </Dialog>
      ) : null}

      <Column gap={1.5}>
        <Row justify="flex-end">
          <StyledTokenButton onClick={handleAdd} color={'accent'}>
            <Trans>+ New Position</Trans>
          </StyledTokenButton>
        </Row>
        <MainContainer style={{ padding: '32px 16px' }}>
          <Column align="center" justify="space-between" gap={1.5}>
            {
              <>
                <Row justify="center">
                  <LargeIcon icon={Inbox} size={2} />
                </Row>
                <ThemedText.Body1 textAlign="center">
                  <Trans>Your active V3 liquidity positions will appear here.</Trans>
                </ThemedText.Body1>
              </>
            }
            {!account || !isActive ? <ConnectWalletButton /> : null}
          </Column>
        </MainContainer>
      </Column>
    </ModuleContainer>
  )
}
