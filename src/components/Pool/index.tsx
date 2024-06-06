import { useState } from 'react'
import { Trans } from '@lingui/macro'
import { Inbox } from 'react-feather'
import styled, { css } from 'styled-components'
import { ResponsiveDialog } from 'components/ResponsiveDialog'
import AddLiquidityWrapper from 'components/AddLiquidity'

const PoolContainer = styled.div`
  text-align: center;
  width: 100%;
  padding: 2rem 1rem;
  border: 1px solid grey;
  border-radius: 0.5rem;
`

const PoolHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.3rem;
  margin: 0.7rem 0;
`

const IconStyle = css`
  width: 40px;
  height: 40px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const ResponsiveButton = styled.div`
  border-radius: 8px;
  font-size: 16px;
  background: red;
  color: white;
  padding: 0.5rem;
`

const InboxIcon = styled(Inbox)`
  ${IconStyle}
`

export default function Pool() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <PoolHeader>
        <Trans>Position</Trans>

        <ResponsiveDialog
          open={open}
          setOpen={setOpen}
          defaultView="dialog"
          anchor={
            <ResponsiveButton data-testid="position-button" onClick={() => setOpen(!open)}>
              + New Position
            </ResponsiveButton>
          }
          mobileBottomSheet={true}
          bottomSheetTitle="New Position"
        >
          Add Liquidity
          {/* <AddLiquidityWrapper /> */}
        </ResponsiveDialog>
      </PoolHeader>
      <PoolContainer>
        <div style={{ display: 'block', textAlign: 'center' }}>
          <InboxIcon strokeWidth={1} style={{ marginTop: '2em' }} />
          <div>
            <Trans>Your active V3 liquidity positions will appear here.</Trans>
          </div>
        </div>
      </PoolContainer>
    </>
  )
}
