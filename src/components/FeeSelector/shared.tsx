import { t } from '@lingui/macro'
import { ChainId, SUPPORTED_CHAINS } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'

export const FEE_AMOUNT_DETAIL: Record<
  FeeAmount,
  { label: string; description: string; supportedChains: readonly ChainId[] }
> = {
  [FeeAmount.LOWEST]: {
    label: '0.01',
    description: t`Best for very stable pairs.`,
    supportedChains: [
      ChainId.ARBITRUM_ONE,
      ChainId.BNB,
      ChainId.CELO,
      ChainId.CELO_ALFAJORES,
      ChainId.MAINNET,
      ChainId.OPTIMISM,
      ChainId.POLYGON,
      ChainId.POLYGON_MUMBAI,
      ChainId.AVALANCHE,
      ChainId.BASE,
    ],
  },
  [FeeAmount.LOW]: {
    label: '0.05',
    description: t`Best for stable pairs.`,
    supportedChains: SUPPORTED_CHAINS,
  },
  [FeeAmount.MEDIUM]: {
    label: '0.3',
    description: t`Best for most pairs.`,
    supportedChains: SUPPORTED_CHAINS,
  },
  [FeeAmount.HIGH]: {
    label: '1',
    description: t`Best for exotic pairs.`,
    supportedChains: SUPPORTED_CHAINS,
  },
}
