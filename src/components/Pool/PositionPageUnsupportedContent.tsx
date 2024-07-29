import { Trans } from '@lingui/macro'
// import { ButtonPrimary } from 'components/Button'
import Button from 'components/Button'
import styled from 'styled-components'
import { ThemedText } from 'theme'
import { WIDGET_BREAKPOINTS } from 'theme/breakpoints'

const PositionPageButtonPrimary = styled(Button)`
  width: 228px;
  height: 40px;
  font-size: 16px;
  line-height: 20px;
  border-radius: 12px;
  width: fit-content;
`

const PageWrapper = styled.div`
  padding: 68px 16px 16px 16px;

  min-width: 800px;
  max-width: 960px;

  @media only screen and (max-width: ${({ theme }) => `${WIDGET_BREAKPOINTS.MEDIUM}px`}) {
    min-width: 100%;
    padding: 16px;
  }

  @media only screen and (max-width: ${({ theme }) => `${WIDGET_BREAKPOINTS.SMALL}px`}) {
    min-width: 100%;
    padding: 16px;
  }
`

export default function PositionPageUnsupportedContent({ onClose = () => null }: { onClose?: () => void } = {}) {
  return (
    <PageWrapper>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <ThemedText.Subhead1 style={{ marginBottom: '8px' }}>
          <Trans>Position unavailable</Trans>
        </ThemedText.Subhead1>
        <ThemedText.Body1 style={{ marginBottom: '32px' }}>
          <Trans>To view a position, you must be connected to the network it belongs to.</Trans>
        </ThemedText.Body1>
        <PositionPageButtonPrimary onClick={onClose}>
          <Trans>Back to Pools</Trans>
        </PositionPageButtonPrimary>
      </div>
    </PageWrapper>
  )
}
