export function calculatePercentage(currentPrice, newPrice) {
    return ((newPrice - currentPrice) / currentPrice) * 100;
}
export function fromWeiToEth(wei) {
    return +wei / 1e18;
}
export function isTargetCoin(state) {
    return (state &&
        state.userId &&
        state.percentage &&
        state.target &&
        (state.target.price ||
            state.target.symbol));
}
export function isTargetNftCollection(state) {
    return (state &&
        state.userId &&
        state.percentage &&
        state.target &&
        (state.target.floorPrice ||
            state.target.floorPriceSymbol ||
            state.target.address ||
            state.target.chain));
}
