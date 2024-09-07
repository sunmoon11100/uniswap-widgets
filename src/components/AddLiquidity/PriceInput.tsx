import Button from 'components/Button'
import Column from 'components/Column'
import { InteractiveContainerRounded } from 'components/container/interactive/InteractiveContainer'
import { DecimalInput } from 'components/Input'
import Row from 'components/Row'
import { ThemedText } from 'theme'

function PriceInput({
  label = 'Low Price',
  value = '',
  onChange = (v: string) => null,
}: {
  label?: string
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <InteractiveContainerRounded fullWidth border>
      <Row flex justify="space-between" flow="no-wrap">
        <Column gap={0.25}>
          <ThemedText.Caption color="secondary">{label}</ThemedText.Caption>
          <DecimalInput value={value} onChange={onChange} style={{ fontSize: '1.2rem' }} />
          <ThemedText.Caption color="secondary">ETH per USDC</ThemedText.Caption>
        </Column>

        <Column justify="space-between">
          <Button style={{ padding: 4 }}>
            <ThemedText.Subhead1>+</ThemedText.Subhead1>
          </Button>
          <Button style={{ padding: 4 }}>
            <ThemedText.Subhead1>-</ThemedText.Subhead1>
          </Button>
        </Column>
      </Row>
    </InteractiveContainerRounded>
  )
}

export default PriceInput
