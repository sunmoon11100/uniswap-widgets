import { Trans, t } from '@lingui/macro'
import { FeeAmount } from '@uniswap/v3-sdk'
import Button from 'components/Button'
import Column from 'components/Column'
import Row from 'components/Row'
import { InteractiveContainerRounded } from 'components/container/interactive/InteractiveContainer'
import ModuleContainer from 'components/container/module'
import { Check, LargeIcon } from 'icons'
import { PropsWithChildren, useState } from 'react'
import { ThemedText } from 'theme'
import { formatTransactionAmount } from 'utils/formatNumbers'

function FeeSelectChip({ children }: PropsWithChildren) {
  return (
    <ModuleContainer style={{ padding: 4 }}>
      <ThemedText.Badge color="secondary">
        <Trans>{children}</Trans>
      </ThemedText.Badge>
    </ModuleContainer>
  )
}

function FeeSelectCard({
  isActive = false,
  label = '',
  caption = '',
  chipLabel = '',
  onClick,
}: {
  isActive?: boolean
  label?: string
  caption?: string
  chipLabel?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) {
  return (
    <InteractiveContainerRounded
      borderColor={isActive ? 'accent' : 'hint'}
      onClick={onClick}
      border
      padding={'1rem'}
      style={{ flexGrow: 1, cursor: 'pointer' }}
    >
      <Column gap={0.25}>
        <Row justify="space-between">
          <ThemedText.Subhead1>
            <Trans>{label}</Trans>
          </ThemedText.Subhead1>
          {isActive ? <LargeIcon icon={Check} color="container" /> : null}
        </Row>
        <ThemedText.Body2 color="secondary">
          <Trans>{caption}</Trans>
        </ThemedText.Body2>
        <FeeSelectChip>{chipLabel}</FeeSelectChip>
      </Column>
    </InteractiveContainerRounded>
  )
}

function FeeSelect({ value, onChange = () => null }: { value?: FeeAmount; onChange?: (v: FeeAmount) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen((s = false) => !s)

  return (
    <Column flex gap={0.5}>
      <InteractiveContainerRounded border fullWidth padding={'1rem'}>
        <Row justify="space-between">
          <Column gap={0.5} align="start">
            <ThemedText.Subhead1>
              <Trans>{formatTransactionAmount((value ?? FeeAmount.LOW) / 10000)}% fee tier</Trans>
            </ThemedText.Subhead1>
            <FeeSelectChip>67% selected</FeeSelectChip>
          </Column>

          <Button style={{ padding: 4 }} onClick={handleToggle}>
            {isOpen ? t`Hide` : t`Edit`}
          </Button>
        </Row>
      </InteractiveContainerRounded>

      {isOpen ? (
        <Row flex gap={0.5}>
          {[
            { label: '0.01%', caption: 'Best for very stable pairs.', value: FeeAmount.LOWEST, chipLabel: '0% select' },
            { label: '0.05%', caption: 'Best for stable pairs.', value: FeeAmount.LOW, chipLabel: '67% select' },
            { label: '0.30%', caption: 'Best for most pairs.', value: FeeAmount.MEDIUM, chipLabel: '32% select' },
            { label: '1.00%', caption: 'Best for exotic pairs.', value: FeeAmount.HIGH, chipLabel: '1% select' },
          ].map((item, itemIndex) => {
            return (
              <FeeSelectCard
                key={itemIndex}
                isActive={item.value === value}
                label={item.label}
                caption={item.caption}
                chipLabel={item.chipLabel}
                onClick={() => onChange(item.value)}
              />
            )
          })}
        </Row>
      ) : null}
    </Column>
  )
}

export default FeeSelect
