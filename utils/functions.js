import numeral from "numeral";

const formatNumber = num => numeral(num).format("0,0.00")
const formatDollarAmount = num => numeral(num).format("$0,0.00");

export {
    formatNumber,
    formatDollarAmount
};
