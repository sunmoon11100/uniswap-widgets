"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NATIVE_OVERHEAD = exports.NATIVE_UNWRAP_OVERHEAD = exports.NATIVE_WRAP_OVERHEAD = exports.TOKEN_OVERHEAD = exports.SINGLE_HOP_OVERHEAD = exports.COST_PER_HOP = exports.COST_PER_INIT_TICK = exports.BASE_SWAP_COST = exports.COST_PER_UNINIT_TICK = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const sdk_core_1 = require("@uniswap/sdk-core");
const providers_1 = require("../../../../providers");
// Cost for crossing an uninitialized tick.
exports.COST_PER_UNINIT_TICK = bignumber_1.BigNumber.from(0);
//l2 execution fee on optimism is roughly the same as mainnet
const BASE_SWAP_COST = (id) => {
    switch (id) {
        case sdk_core_1.ChainId.MAINNET:
        case sdk_core_1.ChainId.GOERLI:
        case sdk_core_1.ChainId.SEPOLIA:
        case sdk_core_1.ChainId.OPTIMISM:
        case sdk_core_1.ChainId.OPTIMISM_GOERLI:
        case sdk_core_1.ChainId.OPTIMISM_SEPOLIA:
        case sdk_core_1.ChainId.BNB:
        case sdk_core_1.ChainId.AVALANCHE:
        case sdk_core_1.ChainId.BASE:
        case sdk_core_1.ChainId.BASE_GOERLI:
        case sdk_core_1.ChainId.ZORA:
        case sdk_core_1.ChainId.ZORA_SEPOLIA:
        case sdk_core_1.ChainId.ROOTSTOCK:
        case sdk_core_1.ChainId.BLAST:
        case sdk_core_1.ChainId.COSTON2:
            return bignumber_1.BigNumber.from(2000);
        case sdk_core_1.ChainId.ARBITRUM_ONE:
        case sdk_core_1.ChainId.ARBITRUM_GOERLI:
        case sdk_core_1.ChainId.ARBITRUM_SEPOLIA:
            return bignumber_1.BigNumber.from(5000);
        case sdk_core_1.ChainId.POLYGON:
        case sdk_core_1.ChainId.POLYGON_MUMBAI:
            return bignumber_1.BigNumber.from(2000);
        case sdk_core_1.ChainId.CELO:
        case sdk_core_1.ChainId.CELO_ALFAJORES:
            return bignumber_1.BigNumber.from(2000);
        //TODO determine if sufficient
        case sdk_core_1.ChainId.GNOSIS:
            return bignumber_1.BigNumber.from(2000);
        case sdk_core_1.ChainId.MOONBEAM:
            return bignumber_1.BigNumber.from(2000);
    }
};
exports.BASE_SWAP_COST = BASE_SWAP_COST;
const COST_PER_INIT_TICK = (id) => {
    switch (id) {
        case sdk_core_1.ChainId.MAINNET:
        case sdk_core_1.ChainId.GOERLI:
        case sdk_core_1.ChainId.SEPOLIA:
        case sdk_core_1.ChainId.BNB:
        case sdk_core_1.ChainId.AVALANCHE:
            return bignumber_1.BigNumber.from(31000);
        case sdk_core_1.ChainId.OPTIMISM:
        case sdk_core_1.ChainId.OPTIMISM_GOERLI:
        case sdk_core_1.ChainId.OPTIMISM_SEPOLIA:
        case sdk_core_1.ChainId.BASE:
        case sdk_core_1.ChainId.BASE_GOERLI:
        case sdk_core_1.ChainId.ZORA:
        case sdk_core_1.ChainId.ZORA_SEPOLIA:
        case sdk_core_1.ChainId.ROOTSTOCK:
        case sdk_core_1.ChainId.BLAST:
        case sdk_core_1.ChainId.COSTON2:
            return bignumber_1.BigNumber.from(31000);
        case sdk_core_1.ChainId.ARBITRUM_ONE:
        case sdk_core_1.ChainId.ARBITRUM_GOERLI:
        case sdk_core_1.ChainId.ARBITRUM_SEPOLIA:
            return bignumber_1.BigNumber.from(31000);
        case sdk_core_1.ChainId.POLYGON:
        case sdk_core_1.ChainId.POLYGON_MUMBAI:
            return bignumber_1.BigNumber.from(31000);
        case sdk_core_1.ChainId.CELO:
        case sdk_core_1.ChainId.CELO_ALFAJORES:
            return bignumber_1.BigNumber.from(31000);
        case sdk_core_1.ChainId.GNOSIS:
            return bignumber_1.BigNumber.from(31000);
        case sdk_core_1.ChainId.MOONBEAM:
            return bignumber_1.BigNumber.from(31000);
    }
};
exports.COST_PER_INIT_TICK = COST_PER_INIT_TICK;
const COST_PER_HOP = (id) => {
    switch (id) {
        case sdk_core_1.ChainId.MAINNET:
        case sdk_core_1.ChainId.GOERLI:
        case sdk_core_1.ChainId.SEPOLIA:
        case sdk_core_1.ChainId.BNB:
        case sdk_core_1.ChainId.OPTIMISM:
        case sdk_core_1.ChainId.OPTIMISM_GOERLI:
        case sdk_core_1.ChainId.OPTIMISM_SEPOLIA:
        case sdk_core_1.ChainId.AVALANCHE:
        case sdk_core_1.ChainId.BASE:
        case sdk_core_1.ChainId.BASE_GOERLI:
        case sdk_core_1.ChainId.ZORA:
        case sdk_core_1.ChainId.ZORA_SEPOLIA:
        case sdk_core_1.ChainId.ROOTSTOCK:
        case sdk_core_1.ChainId.BLAST:
        case sdk_core_1.ChainId.COSTON2:
            return bignumber_1.BigNumber.from(80000);
        case sdk_core_1.ChainId.ARBITRUM_ONE:
        case sdk_core_1.ChainId.ARBITRUM_GOERLI:
        case sdk_core_1.ChainId.ARBITRUM_SEPOLIA:
            return bignumber_1.BigNumber.from(80000);
        case sdk_core_1.ChainId.POLYGON:
        case sdk_core_1.ChainId.POLYGON_MUMBAI:
            return bignumber_1.BigNumber.from(80000);
        case sdk_core_1.ChainId.CELO:
        case sdk_core_1.ChainId.CELO_ALFAJORES:
            return bignumber_1.BigNumber.from(80000);
        case sdk_core_1.ChainId.GNOSIS:
            return bignumber_1.BigNumber.from(80000);
        case sdk_core_1.ChainId.MOONBEAM:
            return bignumber_1.BigNumber.from(80000);
    }
};
exports.COST_PER_HOP = COST_PER_HOP;
const SINGLE_HOP_OVERHEAD = (_id) => {
    return bignumber_1.BigNumber.from(15000);
};
exports.SINGLE_HOP_OVERHEAD = SINGLE_HOP_OVERHEAD;
const TOKEN_OVERHEAD = (id, route) => {
    const tokens = route.tokenPath;
    let overhead = bignumber_1.BigNumber.from(0);
    if (id == sdk_core_1.ChainId.MAINNET) {
        // AAVE's transfer contains expensive governance snapshotting logic. We estimate
        // it at around 150k.
        if (tokens.some((t) => t.equals(providers_1.AAVE_MAINNET))) {
            overhead = overhead.add(150000);
        }
        // LDO's reaches out to an external token controller which adds a large overhead
        // of around 150k.
        if (tokens.some((t) => t.equals(providers_1.LIDO_MAINNET))) {
            overhead = overhead.add(150000);
        }
    }
    return overhead;
};
exports.TOKEN_OVERHEAD = TOKEN_OVERHEAD;
// TODO: change per chain
const NATIVE_WRAP_OVERHEAD = (id) => {
    switch (id) {
        default:
            return bignumber_1.BigNumber.from(27938);
    }
};
exports.NATIVE_WRAP_OVERHEAD = NATIVE_WRAP_OVERHEAD;
const NATIVE_UNWRAP_OVERHEAD = (id) => {
    switch (id) {
        default:
            return bignumber_1.BigNumber.from(36000);
    }
};
exports.NATIVE_UNWRAP_OVERHEAD = NATIVE_UNWRAP_OVERHEAD;
const NATIVE_OVERHEAD = (chainId, amount, quote) => {
    if (amount.isNative) {
        // need to wrap eth in
        return (0, exports.NATIVE_WRAP_OVERHEAD)(chainId);
    }
    if (quote.isNative) {
        // need to unwrap eth out
        return (0, exports.NATIVE_UNWRAP_OVERHEAD)(chainId);
    }
    return bignumber_1.BigNumber.from(0);
};
exports.NATIVE_OVERHEAD = NATIVE_OVERHEAD;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLWNvc3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2dhcy1tb2RlbHMvdjMvZ2FzLWNvc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUFxRDtBQUNyRCxnREFBNkQ7QUFFN0QscURBQW1FO0FBR25FLDJDQUEyQztBQUM5QixRQUFBLG9CQUFvQixHQUFHLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXRELDZEQUE2RDtBQUN0RCxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQVcsRUFBYSxFQUFFO0lBQ3ZELFFBQVEsRUFBRSxFQUFFO1FBQ1YsS0FBSyxrQkFBTyxDQUFDLE9BQU8sQ0FBQztRQUNyQixLQUFLLGtCQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3BCLEtBQUssa0JBQU8sQ0FBQyxPQUFPLENBQUM7UUFDckIsS0FBSyxrQkFBTyxDQUFDLFFBQVEsQ0FBQztRQUN0QixLQUFLLGtCQUFPLENBQUMsZUFBZSxDQUFDO1FBQzdCLEtBQUssa0JBQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5QixLQUFLLGtCQUFPLENBQUMsR0FBRyxDQUFDO1FBQ2pCLEtBQUssa0JBQU8sQ0FBQyxTQUFTLENBQUM7UUFDdkIsS0FBSyxrQkFBTyxDQUFDLElBQUksQ0FBQztRQUNsQixLQUFLLGtCQUFPLENBQUMsV0FBVyxDQUFDO1FBQ3pCLEtBQUssa0JBQU8sQ0FBQyxJQUFJLENBQUM7UUFDbEIsS0FBSyxrQkFBTyxDQUFDLFlBQVksQ0FBQztRQUMxQixLQUFLLGtCQUFPLENBQUMsU0FBUyxDQUFDO1FBQ3ZCLEtBQUssa0JBQU8sQ0FBQyxLQUFLLENBQUM7UUFDbkIsS0FBSyxrQkFBTyxDQUFDLE9BQU87WUFDbEIsT0FBTyxxQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixLQUFLLGtCQUFPLENBQUMsWUFBWSxDQUFD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