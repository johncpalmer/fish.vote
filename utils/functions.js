import numeral from "numeral";

const formatNumber = (num, format = "0,0.00") => (num < 1) ? num : numeral(num).format(format);
const formatDollarAmount = (num, format = "$0,0.00") => {
  if (num < 1) {
    return "N/A"
  }
  
  return numeral(num).format(format);
}

export {
  formatNumber,
  formatDollarAmount,
};
