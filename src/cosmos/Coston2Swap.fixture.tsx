import { darkTheme, defaultTheme, lightTheme, SwapWidget, Theme } from '@uniswap/widgets'
import Row from 'components/Row'
import { CHAIN_NAMES_TO_IDS } from 'constants/chains'
import { useEffect } from 'react'
import { useValue } from 'react-cosmos/fixture'

import useOption from './useOption'
import useProvider from './useProvider'

function Fixture() {
  const [width] = useValue('width', { defaultValue: 360 })

  const [theme, setTheme] = useValue('theme', { defaultValue: defaultTheme })
  const [darkMode] = useValue('darkMode', { defaultValue: true })
  useEffect(() => setTheme((theme) => ({ ...theme, ...(darkMode ? darkTheme : lightTheme) })), [darkMode, setTheme])

  const defaultNetwork = useOption('defaultChainId', {
    options: Object.keys(CHAIN_NAMES_TO_IDS),
    defaultValue: 'coston2',
  })
  const defaultChainId = defaultNetwork ? CHAIN_NAMES_TO_IDS[defaultNetwork] : undefined

  const connector = useProvider(defaultChainId)

  const tokenList = [
    {
      name: 'Wrapped Coston2Flare',
      address: '0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273',
      symbol: 'WC2FLR',
      decimals: 18,
      chainId: 114,
    },
    {
      name: 'Pixel Shard',
      address: '0xa6FfF50C671023eCbd83F4a259bB0fDA20faEbC4',
      symbol: 'PXLs',
      decimals: 18,
      chainId: 114,
    },
  ]

  const widget = (
    <SwapWidget
      hideConnectionUI={true}
      defaultChainId={defaultChainId}
      defaultInputTokenAddress={'0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273'}
      defaultOutputTokenAddress={'0xa6FfF50C671023eCbd83F4a259bB0fDA20faEbC4'}
      provider={connector}
      theme={theme}
      tokenList={tokenList}
      width={width}
      brandedFooter={false}
    />
  )

  // If framed in a different origin, only display the SwapWidget, without any chrome.
  // This is done to faciliate iframing in the documentation (https://docs.uniswap.org).
  if (!window.frameElement) return widget

  return (
    <Row flex align="start" justify="start" gap={0.5}>
      {widget}
    </Row>
  )
}

export default <Fixture />
