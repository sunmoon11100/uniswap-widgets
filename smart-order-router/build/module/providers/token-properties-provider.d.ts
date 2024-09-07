import { ChainId, Token } from '@uniswap/sdk-core';
import { ICache } from './cache';
import { ProviderConfig } from './provider';
import { ITokenFeeFetcher, TokenFeeResult } from './token-fee-fetcher';
import { ITokenValidatorProvider, TokenValidationResult } from './token-validator-provider';
export declare const DEFAULT_TOKEN_PROPERTIES_RESULT: TokenPropertiesResult;
declare type Address = string;
export declare type TokenPropertiesResult = {
    tokenFeeResult?: TokenFeeResult;
    tokenValidationResult?: TokenValidationResult;
};
export declare type TokenPropertiesMap = Record<Address, TokenPropertiesResult>;
export interface ITokenPropertiesProvider {
    getTokensProperties(tokens: Token[], providerConfig?: ProviderConfig): Promise<TokenPropertiesMap>;
}
export declare class TokenPropertiesProvider implements ITokenPropertiesProvider {
    private chainId;
    private tokenValidatorProvider;
    private tokenPropertiesCache;
    private tokenFeeFetcher;
    private allowList;
    private CACHE_KEY;
    constructor(chainId: ChainId, tokenValidatorProvider: ITokenValidatorProvider, tokenPropertiesCache: ICache<TokenPropertiesResult>, tokenFeeFetcher: ITokenFeeFetcher, allowList?: Set<string>);
    getTokensProperties(tokens: Token[], providerConfig?: ProviderConfig): Promise<TokenPropertiesMap>;
    private buildAddressesRaw;
}
export {};
