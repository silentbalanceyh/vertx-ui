const toMock = (jsx = {}, reference) => {
    const {config = {}} = jsx;
    if (config.mock) {
        const {mock = {}} = reference.state;
        jsx.mock = mock[config.mock];
    }
};
const toConfig = (reference, jsx = {}, fnDatum) => {
    const {config = {}, ...others} = jsx;
    const {datum, ...rest} = config;
    const source = fnDatum(reference, {datum, ...rest});
    if (config.table) {
        const {table = {}, ...left} = rest;
        return {source, table, config: left, ...others};
    } else {
        return {source, config: rest, ...others};
    }
};
export default {
    toMock,
    toConfig,
};