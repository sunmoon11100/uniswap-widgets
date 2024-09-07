import { Trans } from '@lingui/macro'
import Button from 'components/Button'
import Column from 'components/Column'
import Row from 'components/Row'
import { ThemedText } from 'theme'

import PriceInput from './PriceInput'

function PriceRange() {
  return (
    <Column gap={0.5}>
      <Row flex justify="space-between">
        <ThemedText.Body1>
          <Trans>Set Price Range</Trans>
        </ThemedText.Body1>

        <Row flex gap={0.25}>
          <Button style={{ padding: 4 }}>Full range</Button>
        </Row>
      </Row>
      <PriceInput label="Low Price" />
      <PriceInput label="High Price" />
    </Column>
  )
}

export default PriceRange
