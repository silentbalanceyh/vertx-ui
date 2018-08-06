const normalize = (item = {}, value) => {
    if (!item.optionConfig) item.optionConfig = {};
    item.optionConfig.normalize = value.replace(/ /g, '').replace(":", ",");
};
const addonAfter = (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    item.optionJsx.addonAfter = value;
};
const PARSER = {
    normalize,
    addonAfter
};
const parseTo = (item = {}, literal = "") => {
    literal = literal.replace(/ /g, '');
    if (0 < literal.indexOf("=")) {
        const name = literal.split("=")[0];
        const value = literal.split("=")[1];
        if (PARSER[name]) {
            const fun = PARSER[name];
            fun(item, value);
        }
    }
    return item;
};
export default {
    parseTo
}