import blankTokenUrl from 'assets/svg/blank_token.svg'
import styled from 'styled-components'


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
