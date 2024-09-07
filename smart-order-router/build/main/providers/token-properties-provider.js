"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPropertiesProvider = exports.DEFAULT_TOKEN_PROPERTIES_RESULT = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const util_1 = require("../util");
const token_fee_fetcher_1 = require("./token-fee-fetcher");
const token_validator_provider_1 = require("./token-validator-provider");
exports.DEFAULT_TOKEN_PROPERTIES_RESULT = {
    tokenFeeResult: token_fee_fetcher_1.DEFAULT_TOKEN_FEE_RESULT,
};
class TokenPropertiesProvider {
    constructor(chainId, tokenValidatorProvider, tokenPropertiesCache, tokenFeeFetcher, allowList = token_validator_provider_1.DEFAULT_ALLOWLIST) {
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
        if (!(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.enableFeeOnTransferFeeFetching) || this.chainId !== sdk_core_1.ChainId.MAINNET) {
            return tokenToResult;
        }
        const nonAllowlistTokens = tokens.filter((token) => !this.allowList.has(token.address.toLowerCase()));
        const tokenValidationResults = await this.tokenValidatorProvider.validateTokens(nonAllowlistTokens, providerConfig);
        tokens.forEach((token) => {
            if (this.allowList.has(token.address.toLowerCase())) {
                // if the token is in the allowlist, make it UNKNOWN so that we don't fetch the FOT fee on-chain
                tokenToResult[token.address.toLowerCase()] = {
                    tokenValidationResult: token_validator_provider_1.TokenValidationResult.UNKN,
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
                token_validator_provider_1.TokenValidationResult.FOT) {
                addressesToFetchFeesOnchain.push(address);
            }
        }
        if (addressesToFetchFeesOnchain.length > 0) {
            let tokenFeeMap = {};
            try {
                tokenFeeMap = await this.tokenFeeFetcher.fetchFees(addressesToFetchFeesOnchain, providerConfig);
            }
            catch (err) {
                util_1.log.error({ err }, `Error fetching fees for tokens ${addressesToFetchFeesOnchain}`);
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
                        tokenValidationResult: token_validator_provider_1.TokenValidationResult.FOT,
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
exports.TokenPropertiesProvider = TokenPropertiesProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tcHJvcGVydGllcy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdG9rZW4tcHJvcGVydGllcy1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnREFBbUQ7QUFFbkQsa0NBQThCO0FBRzlCLDJEQUs2QjtBQUM3Qix5RUFJb0M7QUFFdkIsUUFBQSwrQkFBK0IsR0FBMEI7SUFDcEUsY0FBYyxFQUFFLDRDQUF3QjtDQUN6QyxDQUFDO0FBZ0JGLE1BQWEsdUJBQXVCO0lBSWxDLFlBQ1UsT0FBZ0IsRUFDaEIsc0JBQStDLEVBQy9DLG9CQUFtRCxFQUNuRCxlQUFpQyxFQUNqQyxZQUFZLDRDQUFpQjtRQUo3QixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBeUI7UUFDL0MseUJBQW9CLEdBQXBCLG9CQUFvQixDQUErQjtRQUNuRCxvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7UUFDakMsY0FBUyxHQUFULFNBQVMsQ0FBb0I7UUFSL0IsY0FBUyxHQUFHLENBQUMsT0FBZ0IsRUFBRSxPQUFlLEVBQUUsRUFBRSxDQUN4RCxvQkFBb0IsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBUXhDLENBQUM7SUFFRyxLQUFLLENBQUMsbUJBQW1CLENBQzlCLE1BQWUsRUFDZixjQUErQjs7UUFFL0IsTUFBTSxhQUFhLEdBQXVCLEVBQUUsQ0FBQztRQUU3QyxJQUFJLENBQUMsQ0FBQSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsOEJBQThCLENBQUEsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLGtCQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3ZGLE9BQU8sYUFBYSxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUN0QyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FB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