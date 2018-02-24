const rxDatum = (data) => {
    const result = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const hittedKey = `tabular.${key.replace(/\./g, '_')}`;
            result[hittedKey] = data[key];
        }
    }
    return result;
};

const rxAssist = (data, key) => {
    const result = {};
    const hittedKey = `assist.${key.replace(/\./g, '_')}`;
    result[hittedKey] = data;
    return result;
};
export default {
    rxDatum,
    rxAssist
}
