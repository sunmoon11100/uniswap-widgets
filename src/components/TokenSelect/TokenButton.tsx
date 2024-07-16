import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import { ChevronDown } from 'icons'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import Button from '../Button'
import Row from '../Row'
import TokenImg from '../TokenImg'
import { Logo } from 'components/Logo'

export const StyledTokenButton = styled(Button)<{ approved?: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.medium}rem;
  min-height: 2rem;
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;

  :enabled {
    transition: none;
  }

  ${TokenImg} {
    filter: ${({ approved }) => approved === false && 'grayscale(1)'};
  }
`

const TokenButtonRow = styled(Row)<{ empty: boolean }>`
  // max-width: 12rem;
  overflow: hidden;
  padding-left: ${({ empty }) => empty && 0.5}rem;
  width: 100%;

  img {
    min-width: 1.2rem;
  }
`

interface TokenButtonProps {
  value?: Currency
  approved?: boolean
  disabled?: boolean
  onClick: () => void
  showLogo?: boolean
}

export default function TokenButton({ value, approved, disabled, onClick, showLogo = false }: TokenButtonProps) {
  return (
    <StyledTokenButton
      onClick={onClick}
      color={value ? 'interactive' : 'accent'}
      approved={approved}
      disabled={disabled}
      data-testid="token-select"
    >
      <TokenButtonRow empty={!value} flex gap={0.4} flow="nowrap" justify="space-between">
        {value ? (
          <Row flex gap={0.4}>
            {showLogo ? <Logo currency={value} symbol={value.symbol} /> : null}
            <ThemedText.ButtonLarge color={'currentColor'}>
              <span>{value.symbol}</span>
            </ThemedText.ButtonLarge>
          </Row>
        ) : (
          <ThemedText.ButtonLarge
            color={'onAccent'}
            style={{ maxWidth: '10rem', textOverflow: 'ellipsis', overflow: 'hidden' }}
          >
            <Trans>Select token</Trans>
          </ThemedText.ButtonLarge>
        )}
        <ChevronDown strokeWidth={2} color={value ? 'primary' : 'onAccent'} />
      </TokenButtonRow>
    </StyledTokenButton>
  )
}
