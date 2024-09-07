"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2QuoteProvider = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const sdk_core_1 = require("@uniswap/sdk-core");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const amounts_1 = require("../../util/amounts");
const log_1 = require("../../util/log");
const metric_1 = require("../../util/metric");
const routes_1 = require("../../util/routes");
/**
 * Computes quotes for V2 off-chain. Quotes are computed using the balances
 * of the pools within each route provided.
 *
 * @export
 * @class V2QuoteProvider
 */
class V2QuoteProvider {
    /* eslint-disable @typescript-eslint/no-empty-function */
    constructor() { }
    /* eslint-enable @typescript-eslint/no-empty-function */
    async getQuotesManyExactIn(amountIns, routes, providerConfig) {
        return this.getQuotes(amountIns, routes, sdk_core_1.TradeType.EXACT_INPUT, providerConfig);
    }
    async getQuotesManyExactOut(amountOuts, routes, providerConfig) {
        return this.getQuotes(amountOuts, routes, sdk_core_1.TradeType.EXACT_OUTPUT, providerConfig);
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
                    if (tradeType == sdk_core_1.TradeType.EXACT_INPUT) {
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
                                log_1.log.error({ error }, 'Sell fee bps should not exist on output amount');
                                metric_1.metric.putMetric('V2_QUOTE_PROVIDER_INCONSISTENT_SELL_FEE_BPS_VS_FEATURE_FLAG', 1, metric_1.MetricLoggerUnit.Count);
                            }
                            if (providerConfig.enableFeeOnTransferFeeFetching) {
                                if (pair.token0.equals(outputAmount.currency) &&
                                    ((_a = pair.token0.sellFeeBps) === null || _a === void 0 ? void 0 : _a.gt(bignumber_1.BigNumber.from(0)))) {
                                    const outputAmountWithSellFeeBps = amounts_1.CurrencyAmount.fromRawAmount(pair.token0, outputAmount.quotient);
                                    const [outputAmountNew] = pair.getOutputAmount(outputAmountWithSellFeeBps);
                                    outputAmount = outputAmountNew;
                                }
                                else if (pair.token1.equals(outputAmount.currency) &&
                                    ((_b = pair.token1.sellFeeBps) === null || _b === void 0 ? void 0 : _b.gt(bignumber_1.BigNumber.from(0)))) {
                                    const outputAmountWithSellFeeBps = amounts_1.CurrencyAmount.fromRawAmount(pair.token1, outputAmount.quotient);
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
                            quote: bignumber_1.BigNumber.from(outputAmount.quotient.toString()),
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
                                log_1.log.error({ error }, 'Buy fee bps should not exist on input amount');
                                metric_1.metric.putMetric('V2_QUOTE_PROVIDER_INCONSISTENT_BUY_FEE_BPS_VS_FEATURE_FLAG', 1, metric_1.MetricLoggerUnit.Count);
                            }
                            if (providerConfig.enableFeeOnTransferFeeFetching) {
                                if (pair.token0.equals(inputAmount.currency) &&
                                    ((_c = pair.token0.buyFeeBps) === null || _c === void 0 ? void 0 : _c.gt(bignumber_1.BigNumber.from(0)))) {
                                    const inputAmountWithBuyFeeBps = amounts_1.CurrencyAmount.fromRawAmount(pair.token0, inputAmount.quotient);
                                    [inputAmount] = pair.getInputAmount(inputAmountWithBuyFeeBps);
                                }
                                else if (pair.token1.equals(inputAmount.currency) &&
                                    ((_d = pair.token1.buyFeeBps) === null || _d === void 0 ? void 0 : _d.gt(bignumber_1.BigNumber.from(0)))) {
                                    const inputAmountWithBuyFeeBps = amounts_1.CurrencyAmount.fromRawAmount(pair.token1, inputAmount.quotient);
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
                            quote: bignumber_1.BigNumber.from(inputAmount.quotient.toString()),
                        });
                    }
                }
                catch (err) {
                    // Can fail to get quotes, e.g. throws InsufficientReservesError or InsufficientInputAmountError.
                    if (err instanceof v2_sdk_1.InsufficientInputAmountError) {
                        insufficientInputAmountErrorCount =
                            insufficientInputAmountErrorCount + 1;
                        amountQuotes.push({ amount, quote: null });
                    }
                    else if (err instanceof v2_sdk_1.InsufficientReservesError) {
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
                    (0, routes_1.routeToString)(route),
                ]} Input: ${insufficientInputAmountErrorCount} Reserves: ${insufficientReservesErrorCount} }`);
            }
            routesWithQuotes.push([route, amountQuotes]);
        }
        if (debugStrs.length > 0) {
            log_1.log.info({ debugStrs }, `Failed quotes for V2 routes`);
        }
        return {
            routesWithQuotes,
        };
    }
}
exports.V2QuoteProvider = V2QuoteProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVvdGUtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YyL3F1b3RlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUFxRDtBQUNyRCxnREFBOEM7QUFDOUMsNENBR3lCO0FBR3pCLGdEQUFvRDtBQUNwRCx3Q0FBcUM7QUFDckMsOENBQTZEO0FBQzdELDhDQUFrRDtBQXlCbEQ7Ozs7OztHQU1HO0FBQ0gsTUFBYSxlQUFlO0lBQzFCLHlEQUF5RDtJQUN6RCxnQkFBZSxDQUFDO0lBQ2hCLHdEQUF3RDtJQUVqRCxLQUFLLENBQUMsb0JBQW9CLENBQy9CLFNBQTJCLEVBQzNCLE1BQWlCLEVBQ2pCLGNBQThCO1FBRTlCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FDbkIsU0FBUyxFQUNULE1BQU0sRUFDTixvQkFBUyxDQUFDLFdBQVcsRUFDckIsY0FBYyxDQUNmLENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLHFCQUFxQixDQUNoQyxVQUE0QixFQUM1QixNQUFpQixFQUNqQixjQUE4QjtRQUU5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQ25CLFVBQVUsRUFDVixNQUFNLEVBQ04sb0JBQVMsQ0FBQyxZQUFZLEVBQ3RCLGNBQWMsQ0FDZixDQUFDO0lBQ0osQ0FBQztJQUVPLEtBQUssQ0FBQyxTQUFTLENBQ3JCLE9BQXlCLEVBQ3pCLE1BQWlCLEVBQ2pCLFNBQW9CLEVBQ3BCLGNBQThCOztRQUU5QixNQUFNLGdCQUFnQixHQUF3QixFQUFFLENBQUM7UUFFakQsTUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFDO1FBQy9CLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQzFCLE1BQU0sWUFBWSxHQUFvQixFQUFFLENBQUM7WUFFekMsSUFBSSxpQ0FBaUMsR0FBRyxDQUFDLENBQUM7WUFDMUMsSUFBSSw4QkFBOEIsR0FBRyxDQUFDLENBQUM7WUFDdkMsS0FB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