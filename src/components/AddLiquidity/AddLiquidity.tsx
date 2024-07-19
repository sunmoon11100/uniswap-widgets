import { Trans } from '@lingui/macro'
import { BigintIsh, WETH9 } from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import {
  FACTORY_ADDRESS,
  FeeAmount,
  Pool,
  Position,
  TickDataProvider,
  computePoolAddress,
  nearestUsableTick,
} from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import Column from 'components/Column'
import { StyledTokenButton } from 'components/TokenSelect/TokenButton'
import ScrollContainer from 'components/container/scroll-container'
import { ethers } from 'ethers'
import { useSwapAmount, useSwapCurrency, useSwapInfo } from 'hooks/swap'
import JSBI from 'jsbi'
import { useRef, useState } from 'react'
import { Field } from 'state/swap'
import { ThemedText } from 'theme'
import DepositInput from './DepositInput'
import FeeSelect from './FeeSelect'
import PriceRange from './PriceRange'
import SelectToken from './SelectToken'
import { MintOptions, NonfungiblePositionManager } from '@uniswap/v3-sdk'
import { Percent } from '@uniswap/sdk-core'
import ConnectWalletButton from 'components/Swap/SwapActionButton/ConnectWalletButton'
import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from 'constants/gas'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from 'constants/addresses'

export default function AddLiquidity({
  onMint = () => null,
}: { onMint?: (v: ethers.providers.TransactionResponse) => void } = {}) {
  const contentRef = useRef<HTMLDivElement>(null)

  const { chainId, account, isActive, provider } = useWeb3React()

  const [tokenA, setTokenA] = useSwapCurrency(Field.INPUT)
  const [tokenB, setTokenB] = useSwapCurrency(Field.OUTPUT)
  const [amountA, updateAmountA] = useSwapAmount(Field.INPUT)
  const [amountB, updateAmountB] = useSwapAmount(Field.INPUT)
  const [fee, setFee] = useState<FeeAmount>(FeeAmount.LOW)
  const [sqrtRatio, setSqrtRatio] = useState<BigintIsh>()
  const [liquidity, setLiquidity] = useState<BigintIsh>(JSBI.BigInt('1000000000000000000'))
  const [tickCurrent, setTickCurrent] = useState<number>()
  const [ticks, setTicks] = useState<TickDataProvider>()

  const isTokensSelected = tokenA?.chainId && tokenB?.chainId && chainId

  const handleSave = async () => {
    if (isTokensSelected) {
      const provider = new ethers.providers.JsonRpcProvider()

      const token0 = tokenA.isNative ? WETH9[1] : tokenA
      const token1 = tokenB.isNative ? WETH9[1] : tokenB

      // // approval token addresses
      // const token0Approval = await getTokenTransferApproval(token0Address, amount0, chainId)
      // const token1Approval = await getTokenTransferApproval(token1Address, amount1, chainId)

      const currentPoolAddress = computePoolAddress({
        factoryAddress: FACTORY_ADDRESS,
        tokenA: token0,
        tokenB: token1,
        fee: fee,
      })

      const poolContract = new ethers.Contract(currentPoolAddress, IUniswapV3PoolABI.abi, provider)

      const [liquidity, slot0] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])

      const configuredPool = new Pool(
        token0,
        token1,
        fee,
        slot0.sqrtPriceX96.toString(),
        liquidity.toString(),
        slot0.tick
      )

      const position = Position.fromAmounts({
        pool: configuredPool,
        tickLower:
          nearestUsableTick(configuredPool.tickCurrent, configuredPool.tickSpacing) - configuredPool.tickSpacing * 2,
        tickUpper:
          nearestUsableTick(configuredPool.tickCurrent, configuredPool.tickSpacing) + configuredPool.tickSpacing * 2,
        amount0: JSBI.BigInt(amountA ?? ''),
        amount1: JSBI.BigInt(amountB ?? ''),
        useFullPrecision: true,
      })

      const mintOptions: MintOptions = {
        recipient: account ?? '',
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        slippageTolerance: new Percent(50, 10_000),
      }

      // get calldata for minting a position
      const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, mintOptions)

      const transaction = {
        data: calldata,
        to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        value: value,
        from: account,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
      }

      const signer = provider.getSigner()

      const tx = await signer.sendTransaction(transaction)

      onMint(tx)
    }
  }

  return (
    <ScrollContainer>
      <Column gap={1}>
        <ThemedText.Body1>
          <Trans>Select pair</Trans>
        </ThemedText.Body1>

        <Column gap={0.5} flex align="stretch">
          <SelectToken value={tokenA} onChange={setTokenA} />
          <SelectToken value={tokenB} onChange={setTokenB} />
        </Column>

        {isTokensSelected ? (
          <>
            <FeeSelect value={fee} onChange={setFee} />

            <PriceRange />

            <DepositInput />

            {!account || !isActive ? (
              <ConnectWalletButton />
            ) : (
              <StyledTokenButton onClick={handleSave} color={'accent'}>
                <Trans>Mint</Trans>
              </StyledTokenButton>
            )}
          </>
        ) : null}
      </Column>
    </ScrollContainer>
  )
}
