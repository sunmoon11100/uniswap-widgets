"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeOnChain = exports.ExtendedEther = exports.WRAPPED_NATIVE_CURRENCY = exports.ID_TO_PROVIDER = exports.CHAIN_IDS_LIST = exports.ID_TO_NETWORK_NAME = exports.NATIVE_CURRENCY = exports.NATIVE_NAMES_BY_ID = exports.NativeCurrencyName = exports.ChainName = exports.ID_TO_CHAIN_ID = exports.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = exports.HAS_L1_FEE = exports.V2_SUPPORTED = exports.SUPPORTED_CHAINS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
// WIP: Gnosis, Moonbeam
exports.SUPPORTED_CHAINS = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.OPTIMISM_GOERLI,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.ARBITRUM_GOERLI,
    sdk_core_1.ChainId.POLYGON,
    sdk_core_1.ChainId.POLYGON_MUMBAI,
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.SEPOLIA,
    sdk_core_1.ChainId.CELO_ALFAJORES,
    sdk_core_1.ChainId.CELO,
    sdk_core_1.ChainId.BNB,
    sdk_core_1.ChainId.AVALANCHE,
    sdk_core_1.ChainId.BASE,
    // Gnosis and Moonbeam don't yet have contracts deployed yet
];
exports.V2_SUPPORTED = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.SEPOLIA,
];
exports.HAS_L1_FEE = [
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.OPTIMISM_GOERLI,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.ARBITRUM_GOERLI,
    sdk_core_1.ChainId.BASE,
    sdk_core_1.ChainId.BASE_GOERLI,
];
exports.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.POLYGON,
    sdk_core_1.ChainId.POLYGON_MUMBAI,
];
const ID_TO_CHAIN_ID = (id) => {
    for (const key of Object.keys(sdk_core_1.ChainId)) {
        const value = sdk_core_1.ChainId[key];
        if (value.valueOf() === id) {
            return value;
        }
    }
    throw new Error(`Unknown chain id: ${id}`);
};
exports.ID_TO_CHAIN_ID = ID_TO_CHAIN_ID;
var ChainName;
(function (ChainName) {
    ChainName["MAINNET"] = "mainnet";
    ChainName["GOERLI"] = "goerli";
    ChainName["SEPOLIA"] = "sepolia";
    ChainName["OPTIMISM"] = "optimism-mainnet";
    ChainName["OPTIMISM_GOERLI"] = "optimism-goerli";
    ChainName["ARBITRUM_ONE"] = "arbitrum-mainnet";
    ChainName["ARBITRUM_GOERLI"] = "arbitrum-goerli";
    ChainName["POLYGON"] = "polygon-mainnet";
    ChainName["POLYGON_MUMBAI"] = "polygon-mumbai";
    ChainName["CELO"] = "celo-mainnet";
    ChainName["CELO_ALFAJORES"] = "celo-alfajores";
    ChainName["GNOSIS"] = "gnosis-mainnet";
    ChainName["MOONBEAM"] = "moonbeam-mainnet";
    ChainName["BNB"] = "bnb-mainnet";
    ChainName["AVALANCHE"] = "avalanche-mainnet";
    ChainName["BASE"] = "base-mainnet";
    ChainName["BASE_GOERLI"] = "base-goerli";
    ChainName["COSTON2"] = "coston2";
})(ChainName = exports.ChainName || (exports.ChainName = {}));
var NativeCurrencyName;
(function (NativeCurrencyName) {
    // Strings match input for CLI
    NativeCurrencyName["ETHER"] = "ETH";
    NativeCurrencyName["MATIC"] = "MATIC";
    NativeCurrencyName["CELO"] = "CELO";
    NativeCurrencyName["GNOSIS"] = "XDAI";
    NativeCurrencyName["MOONBEAM"] = "GLMR";
    NativeCurrencyName["BNB"] = "BNB";
    NativeCurrencyName["AVALANCHE"] = "AVAX";
})(NativeCurrencyName = exports.NativeCurrencyName || (exports.NativeCurrencyName = {}));
exports.NATIVE_NAMES_BY_ID = {
    [sdk_core_1.ChainId.MAINNET]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.OPTIMISM]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.ARBITRUM_ONE]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.POLYGON]: [
        'MATIC', '0x0000000000000000000000000000000000001010'
    ],
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: [
        'MATIC',
        '0x0000000000000000000000000000000000001010',
    ],
    [sdk_core_1.ChainId.CELO]: ['CELO'],
    [sdk_core_1.ChainId.CELO_ALFAJORES]: ['CELO'],
    [sdk_core_1.ChainId.GNOSIS]: ['XDAI'],
    [sdk_core_1.ChainId.MOONBEAM]: ['GLMR'],
    [sdk_core_1.ChainId.BNB]: [
        'BNB',
        'BNB',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.AVALANCHE]: [
        'AVAX',
        'AVALANCHE',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.BASE]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ]
};
exports.NATIVE_CURRENCY = {
    [sdk_core_1.ChainId.MAINNET]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.GOERLI]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.SEPOLIA]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.OPTIMISM]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.ARBITRUM_ONE]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.POLYGON]: NativeCurrencyName.MATIC,
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: NativeCurrencyName.MATIC,
    [sdk_core_1.ChainId.CELO]: NativeCurrencyName.CELO,
    [sdk_core_1.ChainId.CELO_ALFAJORES]: NativeCurrencyName.CELO,
    [sdk_core_1.ChainId.GNOSIS]: NativeCurrencyName.GNOSIS,
    [sdk_core_1.ChainId.MOONBEAM]: NativeCurrencyName.MOONBEAM,
    [sdk_core_1.ChainId.BNB]: NativeCurrencyName.BNB,
    [sdk_core_1.ChainId.AVALANCHE]: NativeCurrencyName.AVALANCHE,
    [sdk_core_1.ChainId.BASE]: NativeCurrencyName.ETHER,
};
const ID_TO_NETWORK_NAME = (id) => {
    switch (id) {
        case 1:
            return ChainName.MAINNET;
        case 5:
            return ChainName.GOERLI;
        case 11155111:
            return ChainName.SEPOLIA;
        case 56:
            return ChainName.BNB;
        case 10:
            return ChainName.OPTIMISM;
        case 420:
            return ChainName.OPTIMISM_GOERLI;
        case 42161:
            return ChainName.ARBITRUM_ONE;
        case 421613:
            return ChainName.ARBITRUM_GOERLI;
        case 137:
            return ChainName.POLYGON;
        case 80001:
            return ChainName.POLYGON_MUMBAI;
        case 42220:
            return ChainName.CELO;
        case 44787:
            return ChainName.CELO_ALFAJORES;
        case 100:
            return ChainName.GNOSIS;
        case 1284:
            return ChainName.MOONBEAM;
        case 43114:
            return ChainName.AVALANCHE;
        case 8453:
            return ChainName.BASE;
        case 84531:
            return ChainName.BASE_GOERLI;
        case 114:
            return ChainName.COSTON2;
        default:
            throw new Error(`Unknown chain id: ${id}`);
    }
};
exports.ID_TO_NETWORK_NAME = ID_TO_NETWORK_NAME;
exports.CHAIN_IDS_LIST = Object.values(sdk_core_1.ChainId).map((c) => c.toString());
const ID_TO_PROVIDER = (id) => {
    switch (id) {
        case sdk_core_1.ChainId.MAINNET:
            return process.env.JSON_RPC_PROVIDER;
        case sdk_core_1.ChainId.GOERLI:
            return process.env.JSON_RPC_PROVIDER_GORLI;
        case sdk_core_1.ChainId.SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_SEPOLIA;
        case sdk_core_1.ChainId.OPTIMISM:
            return process.env.JSON_RPC_PROVIDER_OPTIMISM;
        case sdk_core_1.ChainId.OPTIMISM_GOERLI:
            return process.env.JSON_RPC_PROVIDER_OPTIMISM_GOERLI;
        case sdk_core_1.ChainId.ARBITRUM_ONE:
            return process.env.JSON_RPC_PROVIDER_ARBITRUM_ONE;
        case sdk_core_1.ChainId.ARBITRUM_GOERLI:
            return process.env.JSON_RPC_PROVIDER_ARBITRUM_GOERLI;
        case sdk_core_1.ChainId.POLYGON:
            return process.env.JSON_RPC_PROVIDER_POLYGON;
        case sdk_core_1.ChainId.POLYGON_MUMBAI:
            return process.env.JSON_RPC_PROVIDER_POLYGON_MUMBAI;
        case sdk_core_1.ChainId.CELO:
            return process.env.JSON_RPC_PROVIDER_CELO;
        case sdk_core_1.ChainId.CELO_ALFAJORES:
            return process.env.JSON_RPC_PROVIDER_CELO_ALFAJORES;
        case sdk_core_1.ChainId.BNB:
            return process.env.JSON_RPC_PROVIDER_BNB;
        case sdk_core_1.ChainId.AVALANCHE:
            return process.env.JSON_RPC_PROVIDER_AVALANCHE;
        case sdk_core_1.ChainId.BASE:
            return process.env.JSON_RPC_PROVIDER_BASE;
        default:
            throw new Error(`Chain id: ${id} not supported`);
    }
};
exports.ID_TO_PROVIDER = ID_TO_PROVIDER;
exports.WRAPPED_NATIVE_CURRENCY = {
    [sdk_core_1.ChainId.MAINNET]: new sdk_core_1.Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.GOERLI]: new sdk_core_1.Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.SEPOLIA]: new sdk_core_1.Token(11155111, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BNB]: new sdk_core_1.Token(56, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    [sdk_core_1.ChainId.OPTIMISM]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_ONE]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_GOERLI, '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.POLYGON]: new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped MATIC'),
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON_MUMBAI, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC'),
    // The Celo native currency 'CELO' implements the erc-20 token standard
    [sdk_core_1.ChainId.CELO]: new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0x471EcE3750Da237f93B8E339c536989b8978a438', 18, 'CELO', 'Celo native asset'),
    [sdk_core_1.ChainId.CELO_ALFAJORES]: new sdk_core_1.Token(sdk_core_1.ChainId.CELO_ALFAJORES, '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9', 18, 'CELO', 'Celo native asset'),
    [sdk_core_1.ChainId.GNOSIS]: new sdk_core_1.Token(sdk_core_1.ChainId.GNOSIS, '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', 18, 'WXDAI', 'Wrapped XDAI on Gnosis'),
    [sdk_core_1.ChainId.MOONBEAM]: new sdk_core_1.Token(sdk_core_1.ChainId.MOONBEAM, '0xAcc15dC74880C9944775448304B263D191c6077F', 18, 'WGLMR', 'Wrapped GLMR'),
    [sdk_core_1.ChainId.AVALANCHE]: new sdk_core_1.Token(sdk_core_1.ChainId.AVALANCHE, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX'),
    [sdk_core_1.ChainId.BASE]: new sdk_core_1.Token(sdk_core_1.ChainId.BASE, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BASE_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.BASE_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM_SEPOLIA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_SEPOLIA, '0xc556bAe1e86B2aE9c22eA5E036b07E55E7596074', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ZORA]: new sdk_core_1.Token(sdk_core_1.ChainId.ZORA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ZORA_SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.ZORA_SEPOLIA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ROOTSTOCK]: new sdk_core_1.Token(sdk_core_1.ChainId.ROOTSTOCK, '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d', 18, 'WRBTC', 'Wrapped BTC'),
    [sdk_core_1.ChainId.BLAST]: new sdk_core_1.Token(sdk_core_1.ChainId.BLAST, '0x4300000000000000000000000000000000000004', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.COSTON2]: new sdk_core_1.Token(sdk_core_1.ChainId.COSTON2, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
};
function isMatic(chainId) {
    return chainId === sdk_core_1.ChainId.POLYGON_MUMBAI || chainId === sdk_core_1.ChainId.POLYGON;
}
class MaticNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isMatic(this.chainId))
            throw new Error('Not matic');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isMatic(chainId))
            throw new Error('Not matic');
        super(chainId, 18, 'MATIC', 'Polygon Matic');
    }
}
function isCelo(chainId) {
    return chainId === sdk_core_1.ChainId.CELO_ALFAJORES || chainId === sdk_core_1.ChainId.CELO;
}
class CeloNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isCelo(this.chainId))
            throw new Error('Not celo');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isCelo(chainId))
            throw new Error('Not celo');
        super(chainId, 18, 'CELO', 'Celo');
    }
}
function isGnosis(chainId) {
    return chainId === sdk_core_1.ChainId.GNOSIS;
}
class GnosisNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isGnosis(this.chainId))
            throw new Error('Not gnosis');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isGnosis(chainId))
            throw new Error('Not gnosis');
        super(chainId, 18, 'XDAI', 'xDai');
    }
}
function isBnb(chainId) {
    return chainId === sdk_core_1.ChainId.BNB;
}
class BnbNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isBnb(this.chainId))
            throw new Error('Not bnb');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isBnb(chainId))
            throw new Error('Not bnb');
        super(chainId, 18, 'BNB', 'BNB');
    }
}
function isMoonbeam(chainId) {
    return chainId === sdk_core_1.ChainId.MOONBEAM;
}
class MoonbeamNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isMoonbeam(this.chainId))
            throw new Error('Not moonbeam');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isMoonbeam(chainId))
            throw new Error('Not moonbeam');
        super(chainId, 18, 'GLMR', 'Glimmer');
    }
}
function isAvax(chainId) {
    return chainId === sdk_core_1.ChainId.AVALANCHE;
}
class AvalancheNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isAvax(this.chainId))
            throw new Error('Not avalanche');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isAvax(chainId))
            throw new Error('Not avalanche');
        super(chainId, 18, 'AVAX', 'Avalanche');
    }
}
class ExtendedEther extends sdk_core_1.Ether {
    get wrapped() {
        if (this.chainId in exports.WRAPPED_NATIVE_CURRENCY) {
            return exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        }
        throw new Error('Unsupported chain ID');
    }
    static onChain(chainId) {
        var _a;
        return ((_a = this._cachedExtendedEther[chainId]) !== null && _a !== void 0 ? _a : (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId)));
    }
}
exports.ExtendedEther = ExtendedEther;
ExtendedEther._cachedExtendedEther = {};
const cachedNativeCurrency = {};
function nativeOnChain(chainId) {
    if (cachedNativeCurrency[chainId] != undefined) {
        return cachedNativeCurrency[chainId];
    }
    if (isMatic(chainId)) {
        cachedNativeCurrency[chainId] = new MaticNativeCurrency(chainId);
    }
    else if (isCelo(chainId)) {
        cachedNativeCurrency[chainId] = new CeloNativeCurrency(chainId);
    }
    else if (isGnosis(chainId)) {
        cachedNativeCurrency[chainId] = new GnosisNativeCurrency(chainId);
    }
    else if (isMoonbeam(chainId)) {
        cachedNativeCurrency[chainId] = new MoonbeamNativeCurrency(chainId);
    }
    else if (isBnb(chainId)) {
        cachedNativeCurrency[chainId] = new BnbNativeCurrency(chainId);
    }
    else if (isAvax(chainId)) {
        cachedNativeCurrency[chainId] = new AvalancheNativeCurrency(chainId);
    }
    else {
        cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId);
    }
    return cachedNativeCurrency[chainId];
}
exports.nativeOnChain = nativeOnChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvY2hhaW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUFvRjtBQUVwRix3QkFBd0I7QUFDWCxRQUFBLGdCQUFnQixHQUFjO0lBQ3pDLGtCQUFPLENBQUMsT0FBTztJQUNmLGtCQUFPLENBQUMsUUFBUTtJQUNoQixrQkFBTyxDQUFDLGVBQWU7SUFDdkIsa0JBQU8sQ0FBQyxZQUFZO0lBQ3BCLGtCQUFPLENBQUMsZUFBZTtJQUN2QixrQkFBTyxDQUFDLE9BQU87SUFDZixrQkFBTyxDQUFDLGNBQWM7SUFDdEIsa0JBQU8sQ0FBQyxNQUFNO0lBQ2Qsa0JBQU8sQ0FBQyxPQUFPO0lBQ2Ysa0JBQU8sQ0FBQyxjQUFjO0lBQ3RCLGtCQUFPLENBQUMsSUFBSTtJQUNaLGtCQUFPLENBQUMsR0FBRztJQUNYLGtCQUFPLENBQUMsU0FBUztJQUNqQixrQkFBTyxDQUFDLElBQUk7SUFDWiw0REFBNEQ7Q0FDN0QsQ0FBQztBQUVXLFFBQUEsWUFBWSxHQUFHO0lBQzFCLGtCQUFPLENBQUMsT0FBTztJQUNmLGtCQUFPLENBQUMsTUFBTTtJQUNkLGtCQUFPLENBQUMsT0FBTztDQUNoQixDQUFDO0FBRVcsUUFBQSxVQUFVLEdBQUc7SUFDeEIsa0JBQU8sQ0FBQyxRQUFRO0lBQ2hCLGtCQUFPLENBQUMsZUFBZTtJQUN2QixrQkFBTyxDQUFDLFlBQVk7SUFDcEIsa0JBQU8sQ0FBQyxlQUFlO0lBQ3ZCLGtCQUFPLENBQUMsSUFBSTtJQUNaLGtCQUFPLENBQUMsV0FBVztDQUNwQixDQUFDO0FBRVcsUUFBQSxvQ0FBb0MsR0FBRztJQUNsRCxrQkFBTyxDQUFDLE9BQU87SUFDZixrQkFBTyxDQUFDLE1BQU07SUFDZCxrQkFBTyxDQUFDLFFBQVE7SUFDaEIsa0JBQU8sQ0FBQyxZQUFZO0lBQ3BCLGtCQUFPLENBQUMsT0FBTztJQUNmLGtCQUFPLENBQUMsY0FBYztDQUN2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