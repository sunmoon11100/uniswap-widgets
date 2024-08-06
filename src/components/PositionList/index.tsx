import { Trans } from '@lingui/macro'
import Dialog, { Header } from 'components/Dialog'
import PositionPage from 'components/PositionDetail'
import PositionListItem from 'components/PositionListItem'
import RemoveLiquidity from 'components/RemoveLiquidity'
import { BigNumber } from 'ethers'
import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { MEDIA_WIDTHS } from 'theme'
import { PositionDetails } from 'types/position'

const DesktopHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.outline};
  display: none;
  font-size: 14px;
  padding: 16px;

  @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
    align-items: center;
    display: flex;
    justify-content: space-between;
    & > div:last-child {
      text-align: right;
      margin-right: 12px;
    }
  }
`

const MobileHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.outline};
  display: flex;
  font-weight: 535;
  justify-content: space-between;
  padding: 8px;

  @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
    display: none;
  }

  @media screen and (max-width: ${MEDIA_WIDTHS.deprecated_upToExtraSmall}px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`

const ToggleWrap = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`

const ToggleLabel = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-size: 14px;
  font-weight: 485;
`

type PositionListProps = React.PropsWithChildren<{
  positions: PositionDetails[]
  setUserHideClosedPositions: any
  userHideClosedPositions: boolean
  onReload?: () => void
}>

export default function PositionList({
  positions,
  setUserHideClosedPositions,
  userHideClosedPositions,
  onReload = () => null,
}: PositionListProps) {
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [tokenId, setTokenId] = useState<BigNumber>()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<PositionDetails>()

  const handleOpen = (v: PositionDetails) => {
    setSelectedPosition(v)
    setIsOpen(true)
  }

  const handleClose = () => setIsOpen(false)

  const handleDelete = (v: BigNumber) => {
    setTokenId(v)
    setIsOpenDelete(true)
  }

  const handleCloseDelete = () => setIsOpenDelete(false)

  const handleReload = () => {
    handleClose()
    handleCloseDelete()
    onReload()
  }

  const handleIncrease = () => {}

  return (
    <>
      {isOpen && selectedPosition?.tokenId ? (
        <Dialog color="module" onClose={handleClose}>
          <Header title={<Trans>Position Detail</Trans>} />
          <PositionPage
            positionDetails={selectedPosition}
            onClose={handleClose}
            onIncrease={() => handleIncrease()}
            onDelete={() => handleDelete(selectedPosition.tokenId)}
          />
        </Dialog>
      ) : null}

      {isOpenDelete && tokenId ? (
        <Dialog color="module" onClose={handleCloseDelete}>
          <Header title={<Trans>Remove Liquidity</Trans>} />
          <RemoveLiquidity tokenId={tokenId} onClose={handleCloseDelete} onReload={handleReload} />
        </Dialog>
      ) : null}

      <DesktopHeader>
        <div>
          <Trans>Your positions</Trans>
          {positions && ' (' + positions.length + ')'}
        </div>

        <ToggleLabel
          id="desktop-hide-closed-positions"
          onClick={() => {
            setUserHideClosedPositions(!userHideClosedPositions)
          }}
        >
          {userHideClosedPositions ? <Trans>Show closed positions</Trans> : <Trans>Hide closed positions</Trans>}
        </ToggleLabel>
      </DesktopHeader>
      <MobileHeader>
        <Trans>Your positions</Trans>
        <ToggleWrap>
          <ToggleLabel
            onClick={() => {
              setUserHideClosedPositions(!userHideClosedPositions)
            }}
          >
            {userHideClosedPositions ? <Trans>Show closed positions</Trans> : <Trans>Hide closed positions</Trans>}
          </ToggleLabel>
        </ToggleWrap>
      </MobileHeader>
      {positions.map((p) => (
        <PositionListItem key={p.tokenId.toString()} {...p} onOpen={() => handleOpen(p)} />
      ))}
    </>
  )
}
