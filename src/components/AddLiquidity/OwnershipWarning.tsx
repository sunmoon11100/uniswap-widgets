import { Trans } from '@lingui/macro'
import { AlertTriangle } from 'icons'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

const ExplainerText = styled.div`
  color: ${({ theme }) => theme.accent};
`
const TitleRow = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.warning};
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
`
const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.warningSoft};
  border-radius: 16px;
  margin-top: 12px;
  max-width: 480px;
  padding: 12px 20px;
  width: 100%;
`

interface OwnershipWarningProps {
  ownerAddress: string
}

function OwnershipWarning({ ownerAddress }: OwnershipWarningProps) {
  return (
    <Wrapper>
      <TitleRow>
        <AlertTriangle style={{ marginRight: '8px' }} />
        <ThemedText.Subhead2 color="warning">
          <Trans>Warning</Trans>
        </ThemedText.Subhead2>
      </TitleRow>
      <ExplainerText>
        <Trans>
          You are not the owner of this LP position. You will not be able to withdraw the liquidity from this position
          unless you own the following address: {ownerAddress}
        </Trans>
      </ExplainerText>
    </Wrapper>
  )
}

export default OwnershipWarning
