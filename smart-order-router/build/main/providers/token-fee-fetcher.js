"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChainTokenFeeFetcher = exports.DEFAULT_TOKEN_FEE_RESULT = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const sdk_core_1 = require("@uniswap/sdk-core");
const TokenFeeDetector__factory_1 = require("../types/other/factories/TokenFeeDetector__factory");
const util_1 = require("../util");
const DEFAULT_TOKEN_BUY_FEE_BPS = bignumber_1.BigNumber.from(0);
const DEFAULT_TOKEN_SELL_FEE_BPS = bignumber_1.BigNumber.from(0);
// on detector failure, assume no fee
exports.DEFAULT_TOKEN_FEE_RESULT = {
    buyFeeBps: DEFAULT_TOKEN_BUY_FEE_BPS,
    sellFeeBps: DEFAULT_TOKEN_SELL_FEE_BPS,
};
// address at which the FeeDetector lens is deployed
const FEE_DETECTOR_ADDRESS = (chainId) => {
    switch (chainId) {
        case sdk_core_1.ChainId.MAINNET:
        default:
            return '0x19C97dc2a25845C7f9d1d519c8C2d4809c58b43f';
    }
};
// Amount has to be big enough to avoid rounding errors, but small enough that
// most v2 pools will have at least this many token units
// 100000 is the smallest number that avoids rounding errors in bps terms
// 10000 was not sufficient due to rounding errors for rebase token (e.g. stETH)
const AMOUNT_TO_FLASH_BORROW = '100000';
// 1M gas limit per validate call, should cover most swap cases
const GAS_LIMIT_PER_VALIDATE = 1000000;
class OnChainTokenFeeFetcher {
    constructor(chainId, rpcProvider, tokenFeeAddress = FEE_DETECTOR_ADDRESS(chainId), gasLimitPerCall = GAS_LIMIT_PER_VALIDATE, amountToFlashBorrow = AMOUNT_TO_FLASH_BORROW) {
        var _a;
        this.chainId = chainId;
        this.tokenFeeAddress = tokenFeeAddress;
        this.gasLimitPerCall = gasLimitPerCall;
        this.amountToFlashBorrow = amountToFlashBorrow;
        this.BASE_TOKEN = (_a = util_1.WRAPPED_NATIVE_CURRENCY[this.chainId]) === null || _a === void 0 ? void 0 : _a.address;
        this.contract = TokenFeeDetector__factory_1.TokenFeeDetector__factory.connect(this.tokenFeeAddress, rpcProvider);
    }
    async fetchFees(addresses, providerConfig) {
        const tokenToResult = {};
        const functionParams = addresses.map((address) => [
            address,
            this.BASE_TOKEN,
            this.amountToFlashBorrow,
        ]);
        const results = await Promise.all(functionParams.map(async ([address, baseToken, amountToBorrow]) => {
            try {
                // We use the validate function instead of batchValidate to avoid poison pill problem.
                // One token that consumes too much gas could cause the entire batch to fail.
                const feeResult = await this.contract.callStatic.validate(address, baseToken, amountToBorrow, {
                    gasLimit: this.gasLimitPerCall,
                    blockTag: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber,
                });
                return Object.assign({ address }, feeResult);
            }
            catch (err) {
                util_1.log.error({ err }, `Error calling validate on-chain for token ${address}`);
                // in case of FOT token fee fetch failure, we return null
                // so that they won't get returned from the token-fee-fetcher
                // and thus no fee will be applied, and the cache won't cache on FOT tokens with failed fee fetching
                return { address, buyFeeBps: undefined, sellFeeBps: undefined };
            }
        }));
        results.forEach(({ address, buyFeeBps, sellFeeBps }) => {
            if (buyFeeBps || sellFeeBps) {
                tokenToResult[address] = { buyFeeBps, sellFeeBps };
            }
        });
        return tokenToResult;
    }
}
exports.OnChainTokenFeeFetcher = OnChainTokenFeeFetcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tZmVlLWZldGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Rva2VuLWZlZS1mZXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUFxRDtBQUVyRCxnREFBNEM7QUFFNUMsa0dBQStGO0FBRS9GLGtDQUF1RDtBQUl2RCxNQUFNLHlCQUF5QixHQUFHLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sMEJBQTBCLEdBQUcscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFckQscUNBQXFDO0FBQ3hCLFFBQUEsd0JBQXdCLEdBQUc7SUFDdEMsU0FBUyxFQUFFLHlCQUF5QjtJQUNwQyxVQUFVLEVBQUUsMEJBQTBCO0NBQ3ZDLENBQUM7QUFVRixvREFBb0Q7QUFDcEQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtJQUNoRCxRQUFRLE9BQU8sRUFBRTtRQUNmLEtBQUssa0JBQU8sQ0FBQyxPQUFPLENBQUM7UUFDckI7WUFDRSxPQUFPLDRDQUE0QyxDQUFDO0tBQ3ZEO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsOEVBQThFO0FBQzlFLHlEQUF5RDtBQUN6RCx5RUFBeUU7QUFDekUsZ0ZBQWdGO0FBQ2hGLE1BQU0sc0JBQXNCLEdBQUcsUUFBUSxDQUFDO0FBQ3hDLCtEQUErRDtBQUMvRCxNQUFNLHNCQUFzQixHQUFHLE9BQVMsQ0FBQztBQVN6QyxNQUFhLHNCQUFzQjtJQUlqQyxZQUNVLE9BQWdCLEVBQ3hCLFdBQXlCLEVBQ2pCLGtCQUFrQixvQkFBb0IsQ0FBQyxPQUFPLENBQUMsRUFDL0Msa0JBQWtCLHNCQUFzQixFQUN4QyxzQkFBc0Isc0JBQXNCOztRQUo1QyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRWhCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQztRQUMvQyxvQkFBZSxHQUFmLGVBQWUsQ0FBeUI7UUFDeEMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUF5QjtRQUVwRCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQUEsOEJBQXVCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQywwQ0FBRSxPQUFPLENBQUM7UUFDakUsSUFBSSxDQUFDLFFBQVEsR0FBRyxxREFBeUIsQ0FBQyxPQUFPLENBQy9DLElBQUksQ0FBQyxlQUFlLEVBQ3BCLFdBQVcsQ0FDWixDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxTQUFTLENBQ3BCLFNBQW9CLEVBQ3BCLGNBQStCO1FBRS9CLE1BQU0sYUFBYSxHQUFnQixFQUFFLENBQUM7UUFFdEMsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7WUFDaEQsT0FBTztZQUNQLElBQUksQ0FBQyxVQUFVO1lBQ2YsSUFBSSxDQUFDLG1CQUFtQjtTQUN6QixDQUErQixDQUFDO1FBRWpDLE1BQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDL0IsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxFQUFFLEVBQUU7WUFDaEUsSUFBSTtnQkFDRixzRkFBc0Y7Z0JBQ3RGLDZFQUE2RTtnQkFDN0UsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQ3ZELE9BQU8sRUFDUCxTQUFTLEVBQ1QsY0FBYyxFQUNkO29CQUNFLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZTtvQkFDOUIsUUFBUSxFQUFFLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxXQUFXO2lCQUN0QyxDQUNGLENBQUM7Z0JBQ0YsdUJBQVMsT0FBTyxJQUFLLFNBQVMsRUFBRzthQUNsQztZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLFVBQUcsQ0FBQyxLQUFLLENBQ1AsRUFBRSxHQUFHLEVBQUUsRUFDUCw2Q0FBNkMsT0FBTyxFQUFFLENBQ3ZELENBQUM7Z0JBQ0YseURBQXlEO2dCQUN6RCw2REFBNkQ7Z0JBQzdELG9HQUFvRztnQkFDcEcsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsQ0FBQzthQUNqRTtRQUNILENBQUMsQ0FBQyxDQUNILENBQUM7UUFFRixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUU7WUFDckQsSUFBSSxTQUFTLElBQUksVUFBVSxFQUFFO2dCQUMzQixhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLENBQUM7YUFDcEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7Q0FDRjtBQWxFRCx3REFrRUMifQ==