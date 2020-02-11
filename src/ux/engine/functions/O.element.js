import Abs from "../../abyss";
import Dt from '../datum';

const configFabric = (input = {}) => {
    const config = {};
    if ("string" === typeof input) {
        const split = input.split(',');
        config.source = split[0];
        config.field = split[1];
        config.value = split[2];
    } else {
        Object.assign(config, input);
    }
    return config;
};

const valueFabric = (reference, input = {}, consumer) => {
    if (Abs.isFunction(consumer)) {
        const config = configFabric(input);
        const {source, field, value} = config;
        if (source && field && value) {
            const extract = Dt.elementUniqueDatum(reference, source, field, value);
            if (extract) {
                consumer(extract);
            }
        }
    }
};
const valueFabrics = (reference, input = {}, consumer) => {
    if (Abs.isFunction(consumer)) {
        const config = configFabric(input);
        const {source, field, value} = config;
        if (source) {
            let filters = undefined;
            if (field && value) {
                filters = {};
                filters[field] = value;
            }
            let result;
            if (filters) {
                result = Dt.elementFindDatum(reference, source, filters);
            } else {
                result = Dt.onDatum(reference, source);
            }
            if (result) {
                consumer(result);
            }
        }
    }
};
export default {
    valueFabric,
    valueFabrics,
}