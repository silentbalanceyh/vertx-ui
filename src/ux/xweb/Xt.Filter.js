const xtFilter$ = (values = {}) => {
    const filteredValue = {};
    Object.keys(values)
        .filter(key => !key.startsWith("$"))
        .forEach(key => filteredValue[key] = values[key]);
    return filteredValue;
};
export default {
    xtFilter$
}