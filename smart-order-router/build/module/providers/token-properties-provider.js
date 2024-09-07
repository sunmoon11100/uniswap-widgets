import { ChainId } from '@uniswap/sdk-core';
import { log } from '../util';
import { DEFAULT_TOKEN_FEE_RESULT, } from './token-fee-fetcher';
import { DEFAULT_ALLOWLIST, TokenValidationResult, } from './token-validator-provider';
export const DEFAULT_TOKEN_PROPERTIES_RESULT = {
    tokenFeeResult: DEFAULT_TOKEN_FEE_RESULT,
};
export class TokenPropertiesProvider {
    constructor(chainId, tokenValidatorProvider, tokenPropertiesCache, tokenFeeFetcher, allowList = DEFAULT_ALLOWLIST) {
        this.chainId = chainId;
        this.tokenValidatorProvider = tokenValidatorProvider;
        this.tokenPropertiesCache = tokenPropertiesCache;
        this.tokenFeeFetcher = tokenFeeFetcher;
        this.allowList = allowList;
        this.CACHE_KEY = (chainId, address) => `token-properties-${chainId}-${address}`;
    }
    async getTokensProperties(tokens, providerConfig) {
        var _a;
        const tokenToResult = {};
        if (!(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.enableFeeOnTransferFeeFetching) || this.chainId !== ChainId.MAINNET) {
            return tokenToResult;
        }
        const nonAllowlistTokens = tokens.filter((token) => !this.allowList.has(token.address.toLowerCase()));
        const tokenValidationResults = await this.tokenValidatorProvider.validateTokens(nonAllowlistTokens, providerConfig);
        tokens.forEach((token) => {
            if (this.allowList.has(token.address.toLowerCase())) {
                // if the token is in the allowlist, make it UNKNOWN so that we don't fetch the FOT fee on-chain
                tokenToResult[token.address.toLowerCase()] = {
                    tokenValidationResult: TokenValidationResult.UNKN,
                };
            }
            else {
                tokenToResult[token.address.toLowerCase()] = {
                    tokenValidationResult: tokenValidationResults.getValidationByToken(token),
                };
            }
        });
        const addressesToFetchFeesOnchain = [];
        const addressesRaw = this.buildAddressesRaw(tokens);
        const tokenProperties = await this.tokenPropertiesCache.batchGet(addressesRaw);
        // Check if we have cached token validation results for any tokens.
        for (const address of addressesRaw) {
            const cachedValue = tokenProperties[address];
            if (cachedValue) {
                tokenToResult[address] = cachedValue;
            }
            else if (((_a = tokenToResult[address]) === null || _a === void 0 ? void 0 : _a.tokenValidationResult) ===
                TokenValidationResult.FOT) {
                addressesToFetchFeesOnchain.push(address);
            }
        }
        if (addressesToFetchFeesOnchain.length > 0) {
            let tokenFeeMap = {};
            try {
                tokenFeeMap = await this.tokenFeeFetcher.fetchFees(addressesToFetchFeesOnchain, providerConfig);
            }
            catch (err) {
                log.error({ err }, `Error fetching fees for tokens ${addressesToFetchFeesOnchain}`);
            }
            await Promise.all(addressesToFetchFeesOnchain.map((address) => {
                const tokenFee = tokenFeeMap[address];
                if (tokenFee && (tokenFee.buyFeeBps || tokenFee.sellFeeBps)) {
                    const tokenResultForAddress = tokenToResult[address];
                    if (tokenResultForAddress) {
                        tokenResultForAddress.tokenFeeResult = tokenFee;
                    }
                    // update cache concurrently
                    // at this point, we are confident that the tokens are FOT, so we can hardcode the validation result
                    return this.tokenPropertiesCache.set(this.CACHE_KEY(this.chainId, address), {
                        tokenFeeResult: tokenFee,
                        tokenValidationResult: TokenValidationResult.FOT,
                    });
                }
                else {
                    return Promise.resolve(true);
                }
            }));
        }
        return tokenToResult;
    }
    buildAddressesRaw(tokens) {
        const addressesRaw = new Set();
        for (const token of tokens) {
            const address = token.address.toLowerCase();
            if (!addressesRaw.has(address)) {
                addressesRaw.add(address);
            }
        }
        return addressesRaw;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tcHJvcGVydGllcy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdG9rZW4tcHJvcGVydGllcy1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFTLE1BQU0sbUJBQW1CLENBQUM7QUFFbkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUc5QixPQUFPLEVBQ0wsd0JBQXdCLEdBSXpCLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUNMLGlCQUFpQixFQUVqQixxQkFBcUIsR0FDdEIsTUFBTSw0QkFBNEIsQ0FBQztBQUVwQyxNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBMEI7SUFDcEUsY0FBYyxFQUFFLHdCQUF3QjtDQUN6QyxDQUFDO0FBZ0JGLE1BQU0sT0FBTyx1QkFBdUI7SUFJbEMsWUFDVSxPQUFnQixFQUNoQixzQkFBK0MsRUFDL0Msb0JBQW1ELEVBQ25ELGVBQWlDLEVBQ2pDLFlBQVksaUJBQWlCO1FBSjdCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF5QjtRQUMvQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQStCO1FBQ25ELG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQUNqQyxjQUFTLEdBQVQsU0FBUyxDQUFvQjtRQVIvQixjQUFTLEdBQUcsQ0FBQyxPQUFnQixFQUFFLE9BQWUsRUFBRSxFQUFFLENBQ3hELG9CQUFvQixPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7SUFReEMsQ0FBQztJQUVHLEtBQUssQ0FBQyxtQkFBbUIsQ0FDOUIsTUFBZSxFQUNmLGNBQStCOztRQUUvQixNQUFNLGFBQWEsR0FBdUIsRUFBRSxDQUFDO1FBRTdDLElBQUksQ0FBQyxDQUFBLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSw4QkFBOEIsQ0FBQSxJQUFJLElBQUks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