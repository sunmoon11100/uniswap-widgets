import { BigNumber } from '@ethersproject/bignumber';
import { TradeType } from '@uniswap/sdk-core';
import { InsufficientInputAmountError, InsufficientReservesError, } from '@uniswap/v2-sdk';
import { CurrencyAmount } from '../../util/amounts';
import { log } from '../../util/log';
import { metric, MetricLoggerUnit } from '../../util/metric';
import { routeToString } from '../../util/routes';
/**
 * Computes quotes for V2 off-chain. Quotes are computed using the balances
 * of the pools within each route provided.
 *
 * @export
 * @class V2QuoteProvider
 */
export class V2QuoteProvider {
    /* eslint-disable @typescript-eslint/no-empty-function */
    constructor() { }
    /* eslint-enable @typescript-eslint/no-empty-function */
    async getQuotesManyExactIn(amountIns, routes, providerConfig) {
        return this.getQuotes(amountIns, routes, TradeType.EXACT_INPUT, providerConfig);
    }
    async getQuotesManyExactOut(amountOuts, routes, providerConfig) {
        return this.getQuotes(amountOuts, routes, TradeType.EXACT_OUTPUT, providerConfig);
    }
    async getQuotes(amounts, routes, tradeType, providerConfig) {
        var _a, _b, _c, _d;
        const routesWithQuotes = [];
        const debugStrs = [];
        for (const route of routes) {
            const amountQuotes = [];
            let insufficientInputAmountErrorCount = 0;
            let insufficientReservesErrorCount = 0;
            for (const amount of amounts) {
                try {
                    if (tradeType == TradeType.EXACT_INPUT) {
                        let outputAmount = amount.wrapped;
                        for (const pair of route.pairs) {
                            if (amount.wrapped.currency.sellFeeBps) {
                                // this should never happen, but just in case it happens,
                                // there is a bug in sor. We need to log this and investigate.
                                const error = new Error(`Sell fee bps should not exist on output amount
                ${JSON.stringify(amount)} on amounts ${JSON.stringify(amounts)}
                on routes ${JSON.stringify(routes)}`);
                                // artificially create error object and pass in log.error so that
                                // it also log the stack trace
                                log.error({ error }, 'Sell fee bps should not exist on output amount');
                                metric.putMetric('V2_QUOTE_PROVIDER_INCONSISTENT_SELL_FEE_BPS_VS_FEATURE_FLAG', 1, MetricLoggerUnit.Count);
                            }
                            if (providerConfig.enableFeeOnTransferFeeFetching) {
                                if (pair.token0.equals(outputAmount.currency) &&
                                    ((_a = pair.token0.sellFeeBps) === null || _a === void 0 ? void 0 : _a.gt(BigNumber.from(0)))) {
                                    const outputAmountWithSellFeeBps = CurrencyAmount.fromRawAmount(pair.token0, outputAmount.quotient);
                                    const [outputAmountNew] = pair.getOutputAmount(outputAmountWithSellFeeBps);
                                    outputAmount = outputAmountNew;
                                }
                                else if (pair.token1.equals(outputAmount.currency) &&
                                    ((_b = pair.token1.sellFeeBps) === null || _b === void 0 ? void 0 : _b.gt(BigNumber.from(0)))) {
                                    const outputAmountWithSellFeeBps = CurrencyAmount.fromRawAmount(pair.token1, outputAmount.quotient);
                                    const [outputAmountNew] = pair.getOutputAmount(outputAmountWithSellFeeBps);
                                    outputAmount = outputAmountNew;
                                }
                                else {
                                    const [outputAmountNew] = pair.getOutputAmount(outputAmount);
                                    outputAmount = outputAmountNew;
                                }
                            }
                            else {
                                const [outputAmountNew] = pair.getOutputAmount(outputAmount);
                                outputAmount = outputAmountNew;
                            }
                        }
                        amountQuotes.push({
                            amount,
                            quote: BigNumber.from(outputAmount.quotient.toString()),
                        });
                    }
                    else {
                        let inputAmount = amount.wrapped;
                        for (let i = route.pairs.length - 1; i >= 0; i--) {
                            const pair = route.pairs[i];
                            if (amount.wrapped.currency.buyFeeBps) {
                                // this should never happen, but just in case it happens,
                                // there is a bug in sor. We need to log this and investigate.
                                const error = new Error(`Buy fee bps should not exist on input amount
                ${JSON.stringify(amount)} on amounts ${JSON.stringify(amounts)}
                on routes ${JSON.stringify(routes)}`);
                                // artificially create error object and pass in log.error so that
                                // it also log the stack trace
                                log.error({ error }, 'Buy fee bps should not exist on input amount');
                                metric.putMetric('V2_QUOTE_PROVIDER_INCONSISTENT_BUY_FEE_BPS_VS_FEATURE_FLAG', 1, MetricLoggerUnit.Count);
                            }
                            if (providerConfig.enableFeeOnTransferFeeFetching) {
                                if (pair.token0.equals(inputAmount.currency) &&
                                    ((_c = pair.token0.buyFeeBps) === null || _c === void 0 ? void 0 : _c.gt(BigNumber.from(0)))) {
                                    const inputAmountWithBuyFeeBps = CurrencyAmount.fromRawAmount(pair.token0, inputAmount.quotient);
                                    [inputAmount] = pair.getInputAmount(inputAmountWithBuyFeeBps);
                                }
                                else if (pair.token1.equals(inputAmount.currency) &&
                                    ((_d = pair.token1.buyFeeBps) === null || _d === void 0 ? void 0 : _d.gt(BigNumber.from(0)))) {
                                    const inputAmountWithBuyFeeBps = CurrencyAmount.fromRawAmount(pair.token1, inputAmount.quotient);
                                    [inputAmount] = pair.getInputAmount(inputAmountWithBuyFeeBps);
                                }
                                else {
                                    [inputAmount] = pair.getInputAmount(inputAmount);
                                }
                            }
                            else {
                                [inputAmount] = pair.getInputAmount(inputAmount);
                            }
                        }
                        amountQuotes.push({
                            amount,
                            quote: BigNumber.from(inputAmount.quotient.toString()),
                        });
                    }
                }
                catch (err) {
                    // Can fail to get quotes, e.g. throws InsufficientReservesError or InsufficientInputAmountError.
                    if (err instanceof InsufficientInputAmountError) {
                        insufficientInputAmountErrorCount =
                            insufficientInputAmountErrorCount + 1;
                        amountQuotes.push({ amount, quote: null });
                    }
                    else if (err instanceof InsufficientReservesError) {
                        insufficientReservesErrorCount = insufficientReservesErrorCount + 1;
                        amountQuotes.push({ amount, quote: null });
                    }
                    else {
                        throw err;
                    }
                }
            }
            if (insufficientInputAmountErrorCount > 0 ||
                insufficientReservesErrorCount > 0) {
                debugStrs.push(`${[
                    routeToString(route),
                ]} Input: ${insufficientInputAmountErrorCount} Reserves: ${insufficientReservesErrorCount} }`);
            }
            routesWithQuotes.push([route, amountQuotes]);
        }
        if (debugStrs.length > 0) {
            log.info({ debugStrs }, `Failed quotes for V2 routes`);
        }
        return {
            routesWithQuotes,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVvdGUtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YyL3F1b3RlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUMsT0FBTyxFQUNMLDRCQUE0QixFQUM1Qix5QkFBeUIsR0FDMUIsTUFBTSxpQkFBaUIsQ0FBQztBQUd6QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUF5QmxEOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBQzFCLHlEQUF5RDtJQUN6RCxnQkFBZSxDQUFDO0lBQ2hCLHdEQUF3RDtJQUVqRCxLQUFLLENBQUMsb0JBQW9CLENBQy9CLFNBQTJCLEVBQzNCLE1BQWlCLEVBQ2pCLGNBQThCO1FBRTlCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FDbkIsU0FBUyxFQUNULE1BQU0sRUFDTixTQUFTLENBQUMsV0FBVyxFQUNyQixjQUFjLENBQ2YsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMscUJBQXFCLENBQ2hDLFVBQTRCLEVBQzVCLE1BQWlCLEVBQ2pCLGNBQThCO1FBRTlCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FDbkIsVUFBVSxFQUNWLE1BQU0sRUFDTixTQUFTLENBQUMsWUFBWSxFQUN0QixjQUFjLENBQ2YsQ0FBQztJQUNKLENBQUM7SUFFTyxLQUFLLENBQUMsU0FBUyxDQUNyQixPQUF5QixFQUN6QixN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