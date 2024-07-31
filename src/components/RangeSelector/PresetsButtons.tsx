import { Trans } from '@lingui/macro'
import { ButtonOutlined } from 'components/Button'
import { AutoRow } from 'components/Row'
import styled from 'styled-components'
import { ThemedText } from 'theme'

const Button = styled(ButtonOutlined).attrs(() => ({
  padding: '6px',
  $borderRadius: '8px',
}))`
  flex: 1;
`

interface PresetsButtonsProps {
  onSetFullRange: () => void
}

export default function PresetsButtons({ onSetFullRange }: PresetsButtonsProps) {
  return (
    <AutoRow gap="4px">
      <Button data-testid="set-full-range" onClick={onSetFullRange}>
        <ThemedText.Body1 fontSize={12}>
          <Trans>Full range</Trans>
        </ThemedText.Body1>
      </Button>
    </AutoRow>
  )
}
