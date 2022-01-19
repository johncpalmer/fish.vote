import numeral from "numeral";

const formatNumber = num => numeral(num).format("0,0.00")
const formatDollarAmount = num => numeral(num).format("$0,0.00");

const waitForNumBlocks = async (ticker, numBlocks) => {
    for (let i = 0; i < numBlocks; ++i) {
        await ticker.next();
    }
}

export {
    formatNumber,
    formatDollarAmount,
    waitForNumBlocks
};
