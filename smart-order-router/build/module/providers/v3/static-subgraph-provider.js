/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChainId } from '@uniswap/sdk-core';
import { FeeAmount, Pool } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';
import _ from 'lodash';
import { unparseFeeAmount } from '../../util/amounts';
import { WRAPPED_NATIVE_CURRENCY } from '../../util/chains';
import { log } from '../../util/log';
import { ARB_ARBITRUM, BTC_BNB, BUSD_BNB, CELO, CELO_ALFAJORES, CEUR_CELO, CEUR_CELO_ALFAJORES, CUSD_CELO, CUSD_CELO_ALFAJORES, DAI_ARBITRUM, DAI_AVAX, DAI_BNB, DAI_CELO, DAI_CELO_ALFAJORES, DAI_GOERLI, DAI_MAINNET, DAI_MOONBEAM, DAI_OPTIMISM, DAI_OPTIMISM_GOERLI, DAI_POLYGON_MUMBAI, ETH_BNB, OP_OPTIMISM, USDC_ARBITRUM, USDC_ARBITRUM_GOERLI, USDC_AVAX, USDC_BASE, USDC_BNB, USDC_ETHEREUM_GNOSIS, USDC_GOERLI, USDC_MAINNET, USDC_MOONBEAM, USDC_OPTIMISM, USDC_OPTIMISM_GOERLI, USDC_POLYGON, USDC_SEPOLIA, USDT_ARBITRUM, USDT_BNB, USDT_GOERLI, USDT_MAINNET, USDT_OPTIMISM, USDT_OPTIMISM_GOERLI, WBTC_ARBITRUM, WBTC_GNOSIS, WBTC_GOERLI, WBTC_MAINNET, WBTC_MOONBEAM, WBTC_OPTIMISM, WBTC_OPTIMISM_GOERLI, WETH_POLYGON, WMATIC_POLYGON, WMATIC_POLYGON_MUMBAI, WXDAI_GNOSIS } from '../token-provider';
const BASES_TO_CHECK_TRADES_AGAINST = {
    [ChainId.MAINNET]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET],
        DAI_MAINNET,
        USDC_MAINNET,
        USDT_MAINNET,
        WBTC_MAINNET
    ],
    [ChainId.GOERLI]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.GOERLI],
        USDT_GOERLI,
        USDC_GOERLI,
        WBTC_GOERLI,
        DAI_GOERLI
    ],
    [ChainId.SEPOLIA]: [WRAPPED_NATIVE_CURRENCY[ChainId.SEPOLIA], USDC_SEPOLIA],
    [ChainId.OPTIMISM]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.OPTIMISM],
        USDC_OPTIMISM,
        DAI_OPTIMISM,
        USDT_OPTIMISM,
        WBTC_OPTIMISM,
        OP_OPTIMISM
    ],
    [ChainId.ARBITRUM_ONE]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.ARBITRUM_ONE],
        WBTC_ARBITRUM,
        DAI_ARBITRUM,
        USDC_ARBITRUM,
        USDT_ARBITRUM,
        ARB_ARBITRUM
    ],
    [ChainId.ARBITRUM_GOERLI]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.ARBITRUM_GOERLI],
        USDC_ARBITRUM_GOERLI
    ],
    [ChainId.OPTIMISM_GOERLI]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.OPTIMISM_GOERLI],
        USDC_OPTIMISM_GOERLI,
        DAI_OPTIMISM_GOERLI,
        USDT_OPTIMISM_GOERLI,
        WBTC_OPTIMISM_GOERLI
    ],
    [ChainId.POLYGON]: [USDC_POLYGON, WETH_POLYGON, WMATIC_POLYGON],
    [ChainId.POLYGON_MUMBAI]: [
        DAI_POLYGON_MUMBAI,
        WRAPPED_NATIVE_CURRENCY[ChainId.POLYGON_MUMBAI],
        WMATIC_POLYGON_MUMBAI
    ],
    [ChainId.CELO]: [CELO, CUSD_CELO, CEUR_CELO, DAI_CELO],
    [ChainId.CELO_ALFAJORES]: [
        CELO_ALFAJORES,
        CUSD_CELO_ALFAJORES,
        CEUR_CELO_ALFAJORES,
        DAI_CELO_ALFAJORES
    ],
    [ChainId.GNOSIS]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.GNOSIS],
        WBTC_GNOSIS,
        WXDAI_GNOSIS,
        USDC_ETHEREUM_GNOSIS
    ],
    [ChainId.BNB]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.BNB],
        BUSD_BNB,
        DAI_BNB,
        USDC_BNB,
        USDT_BNB,
        BTC_BNB,
        ETH_BNB
    ],
    [ChainId.AVALANCHE]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.AVALANCHE],
        USDC_AVAX,
        DAI_AVAX
    ],
    [ChainId.MOONBEAM]: [
        WRAPPED_NATIVE_CURRENCY[ChainId.MOONBEAM],
        DAI_MOONBEAM,
        USDC_MOONBEAM,
        WBTC_MOONBEAM
    ],
    [ChainId.BASE_GOERLI]: [WRAPPED_NATIVE_CURRENCY[ChainId.BASE_GOERLI]],
    [ChainId.BASE]: [WRAPPED_NATIVE_CURRENCY[ChainId.BASE], USDC_BASE],
    [ChainId.OPTIMISM_SEPOLIA]: [
    //   WRAPPED_NATIVE_CURRENCY[ChainId.OPTIMISM_SEPOLIA]!,
    ],
    [ChainId.ARBITRUM_SEPOLIA]: [
    // WRAPPED_NATIVE_CURRENCY[ChainId.ARBITRUM_SEPOLIA]!,
    ],
    [ChainId.ZORA]: [WRAPPED_NATIVE_CURRENCY[ChainId.ZORA]],
    [ChainId.ZORA_SEPOLIA]: [WRAPPED_NATIVE_CURRENCY[ChainId.ZORA_SEPOLIA]],
    [ChainId.ROOTSTOCK]: [WRAPPED_NATIVE_CURRENCY[ChainId.ROOTSTOCK]],
    [ChainId.BLAST]: [WRAPPED_NATIVE_CURRENCY[ChainId.BLAST]],
    [ChainId.COSTON2]: [WRAPPED_NATIVE_CURRENCY[ChainId.COSTON2]]
};
/**
 * Provider that uses a hardcoded list of V3 pools to generate a list of subgraph pools.
 *
 * Since the pools are hardcoded and the data does not come from the Subgraph, the TVL values
 * are dummys and should not be depended on.
 *
 * Useful for instances where other data sources are unavailable. E.g. Subgraph not available.
 *
 * @export
 * @class StaticV3SubgraphProvider
 */
export class StaticV3SubgraphProvider {
    constructor(chainId, poolProvider) {
        this.chainId = chainId;
        this.poolProvider = poolProvider;
    }
    async getPools(tokenIn, tokenOut, providerConfig) {
        log.info('In static subgraph provider for V3');
        const bases = BASES_TO_CHECK_TRADES_AGAINST[this.chainId];
        const basePairs = _.flatMap(bases, (base) => bases.map((otherBase) => [base, otherBase]));
        if (tokenIn && tokenOut) {
            basePairs.push([tokenIn, tokenOut], ...bases.map((base) => [tokenIn, base]), ...bases.map((base) => [tokenOut, base]));
        }
        const pairs = _(basePairs)
            .filter((tokens) => Boolean(tokens[0] && tokens[1]))
            .filter(([tokenA, tokenB]) => tokenA.address !== tokenB.address && !tokenA.equals(tokenB))
            .flatMap(([tokenA, tokenB]) => {
            return [
                [tokenA, tokenB, FeeAmount.LOWEST],
                [tokenA, tokenB, FeeAmount.LOW],
                [tokenA, tokenB, FeeAmount.MEDIUM],
                [tokenA, tokenB, FeeAmount.HIGH]
            ];
        })
            .value();
        log.info(`V3 Static subgraph provider about to get ${pairs.length} pools on-chain`);
        const poolAccessor = await this.poolProvider.getPools(pairs, providerConfig);
        const pools = poolAccessor.getAllPools();
        const poolAddressSet = new Set();
        const subgraphPools = _(pools)
            .map((pool) => {
            const { token0, token1, fee, liquidity } = pool;
            const poolAddress = Pool.getAddress(pool.token0, pool.token1, pool.fee);
            if (poolAddressSet.has(poolAddress)) {
                return undefined;
            }
            poolAddressSet.add(poolAddress);
            const liquidityNumber = JSBI.toNumber(liquidity);
            return {
                id: poolAddress,
                feeTier: unparseFeeAmount(fee),
                liquidity: liquidity.toString(),
                token0: {
                    id: token0.address
                },
                token1: {
                    id: token1.address
                },
                // As a very rough proxy we just use liquidity for TVL.
                tvlETH: liquidityNumber,
                tvlUSD: liquidityNumber
            };
        })
            .compact()
            .value();
        return subgraphPools;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXN1YmdyYXBoLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy92My9zdGF0aWMtc3ViZ3JhcGgtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNkRBQTZEO0FBQzdELE9BQU8sRUFBRSxPQUFPLEVBQVMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLENBQUMsTUFBTSxRQUFRLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJDLE9BQU8sRUFDTCxZQUFZLEVBQ1osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osY0FBYyxFQUNkLFNBQVMsRUFDVCxtQkFBbUIsRUFDbkIsU0FBUyxFQUNULG1CQUFtQixFQUNuQixZQUFZLEVBQ1osUUFBUSxFQUNSLE9BQU8sRUFDUCxRQUFRLEVBQ1Isa0JBQWtCLEVBQ2xCLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLFlBQVksRUFDWixtQkFBbUIsRUFDbkIsa0JBQWtCLEVBQ2xCLE9BQU8sRUFDUCxXQUFXLEVBQ1gsYUFBYSxFQUNiLG9CQUFvQixFQUNwQixTQUFTLEVBQ1QsU0FBUyxFQUNULFFBQVEsRUFDUixvQkFBb0IsRUFDcEIsV0FBVyxFQUNYLFlBQVksRUFDWixhQUFhLEVBQ2IsYUFBYSxFQUNiLG9CQUFvQixFQUNwQixZQUFZLEVBQ1osWUFBWSxFQUNaLGFBQWEsRUFDYixRQUFRLEVBQ1IsV0FBVyxFQUNYLFlBQVksRUFDWixhQUFhLEVB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