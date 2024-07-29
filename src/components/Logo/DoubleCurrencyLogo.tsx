import blankTokenUrl from 'assets/svg/blank_token.svg'
import styled from 'styled-components'
import { useLogo } from './hooks'
import { Currency } from '@uniswap/sdk-core'

const DoubleLogoContainer = styled.div`
  display: flex;
  gap: 2px;
  position: relative;
  top: 0;
  left: 0;
  img {
    width: 16px;
    height: 32px;
    object-fit: cover;
  }
  img:first-child {
    border-radius: 16px 0 0 16px;
    object-position: 0 0;
  }
  img:last-child {
    border-radius: 0 16px 16px 0;
    object-position: 100% 0;
  }
`

const CircleLogoImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`

interface CurrencyLogoProps {
  currency: Currency
  onError?: () => void
}

export function CurrencyLogo({ currency, onError }: CurrencyLogoProps) {
  const { src: logoSrc, invalidateSrc: invalidateLogoSrc } = useLogo(currency)
  return <CircleLogoImage src={logoSrc ?? blankTokenUrl} onError={onError} />
}

interface DoubleCurrencyLogoProps {
  currency0: Currency
  currency1: Currency
  onError0?: () => void
  onError1?: () => void
}

export function DoubleCurrencyLogo({ currency0, onError0, currency1, onError1 }: DoubleCurrencyLogoProps) {
  const { src: logoSrc0, invalidateSrc: invalidateLogoSrc0 } = useLogo(currency0)
  const { src: logoSrc1, invalidateSrc: invalidateLogoSrc1 } = useLogo(currency1)
  return (
    <DoubleLogoContainer>
      <DoubleLogo logo1={logoSrc0} onError1={invalidateLogoSrc0} logo2={logoSrc1} onError2={invalidateLogoSrc1} />
    </DoubleLogoContainer>
  )
}

interface DoubleLogoProps {
  logo1?: string
  logo2?: string
  onError1?: () => void
  onError2?: () => void
}

export default function DoubleLogo({ logo1, onError1, logo2, onError2 }: DoubleLogoProps) {
  return (
    <DoubleLogoContainer>
      <CircleLogoImage src={logo1 ?? blankTokenUrl} onError={onError1} />
      <CircleLogoImage src={logo2 ?? blankTokenUrl} onError={onError2} />
    </DoubleLogoContainer>
  )
}
