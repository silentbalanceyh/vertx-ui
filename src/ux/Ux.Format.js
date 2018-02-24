import numeral from 'numeral';
const fmtCurrency = (value) => {
    numeral.defaultFormat(`0,0.00`);
    return numeral(value).format();
};
const fmtPercent = (value) => {
    numeral.defaultFormat("0.00%");
    return numeral(value).format();
};
export default {
    fmtCurrency,
    fmtPercent
}
