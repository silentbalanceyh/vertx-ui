const mock = (jsx = {}, reference) => {
    const {config = {}} = jsx;
    if (config.mock) {
        const {mock = {}} = reference.state;
        jsx.mock = mock[config.mock];
    }
};
const toConfig = (reference, jsx = {}, fnDatum) => {
    const {config = {}} = jsx;
    const {datum, ...rest} = config;
    const source = fnDatum(reference, {datum});
    if (config.table) {
        const {table = {}, ...left} = rest;
        return {source, table, config: left};
    } else {
        return {source, config: rest};
    }
};
export default {
    mock,
    toConfig,
};