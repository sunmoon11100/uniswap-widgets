import { darkTheme, defaultTheme, lightTheme, SwapWidget } from '@uniswap/widgets'
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
      name: 'USDT',
      address: '0x02518f90d87826F2E67d3Cf5D8b45882f8874Ab3',
      symbol: 'USDT',
      decimals: 18,
      chainId: 114,
    },
    {
      name: 'USDC',
      address: '0x4Df23a8DBB77aCD6Bdb05dbd5D48b4781FbF952E',
      symbol: 'USDC',
      decimals: 18,
      chainId: 114,
    },
  ]

  const widget = (
    <SwapWidget
      hideConnectionUI={true}
      defaultChainId={defaultChainId}
      defaultInputTokenAddress={'0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273'}
      defaultOutputTokenAddress={'0x02518f90d87826F2E67d3Cf5D8b45882f8874Ab3'}
      // provider={connector}
      // theme={theme}
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
