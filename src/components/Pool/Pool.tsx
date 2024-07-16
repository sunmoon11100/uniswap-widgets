import { Trans } from '@lingui/macro'
import AddLiquidity from 'components/AddLiquidity'
import Column from 'components/Column'
import Dialog, { Header, Modal } from 'components/Dialog'
import Row from 'components/Row'
import { StyledTokenButton } from 'components/TokenSelect/TokenButton'
import MainContainer from 'components/container/main'
import ModuleContainer from 'components/container/module'
import { Inbox, LargeIcon } from 'icons'
import { useState } from 'react'
import { ThemedText } from 'theme'

export default function Pool() {
  const [isOpen, setIsOpen] = useState(true)

  const handleClick = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <ModuleContainer style={{ padding: 16 }}>
      {isOpen ? (
        <Dialog color="module" onClose={handleClose}>
          <Header title={<Trans>Add Liquidity</Trans>} />
          <AddLiquidity />
        </Dialog>
      ) : null}

      <Column gap={1.5}>
        <Row justify="flex-end">
          <StyledTokenButton onClick={handleClick} color={'accent'}>
            <Trans>+ New Position</Trans>
          </StyledTokenButton>
        </Row>
        <MainContainer style={{ padding: '32px 16px' }}>
          <Column align="center" justify="space-between" gap={1.5}>
            <Row justify="center">
              <LargeIcon icon={Inbox} size={2} />
            </Row>
            <ThemedText.Body1 textAlign="center">
              <Trans>Your active V3 liquidity positions will appear here.</Trans>
            </ThemedText.Body1>
            <StyledTokenButton onClick={handleClick} color={'accent'}>
              <Trans>Connect a wallet</Trans>
            </StyledTokenButton>
          </Column>
        </MainContainer>
      </Column>
    </ModuleContainer>
  )
}
