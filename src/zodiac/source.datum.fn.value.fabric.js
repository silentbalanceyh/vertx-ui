import __Zn from './zero.module.dependency';
import __DATUM_CONSUMER from './source.datum.fn.on.consumer';
import __DATUM_QR from './source.datum.fn.element.qr';
import __PR from './source.fn.parse.transformer';

const __configFabric = (input = {}) => {
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
    if (__Zn.isFunction(consumer)) {
        const config = __configFabric(input);
        const {source, field, value} = config;
        if (source && field && value) {
            const extract = __DATUM_QR.elementUniqueDatum(reference, source, field, value);
            if (extract) {
                consumer(extract);
            }
        }
    }
};
const valueFabrics = (reference, input = {}, consumer) => {
    if (__Zn.isFunction(consumer)) {
        const config = __configFabric(input);
        const {source, field, value} = config;
        if (source) {
            let filters = undefined;
            if (field && value) {
                filters = {};
                filters[field] = value;
            }
            let result;
            if (filters) {
                result = __DATUM_QR.elementFindDatum(reference, source, filters);
            } else {
                result = __DATUM_CONSUMER.onDatum(reference, source);
            }
            if (result) {
                consumer(result);
            }
        }
    }
};

const valueQr = (qr = {}, reference) => {
    const request = __Zn.valueValid(qr);
    const $qr = {};
    Object.keys(request)
        .filter(field => __Zn.Env.CV_DELETE !== request[field])
        .forEach(field => {
            const valueField = request[field];
            if (__Zn.isObject(valueField)) {
                $qr[field] = valueQr(valueField, reference);
            } else {
                $qr[field] = __PR.parseValue(request[field], reference)
            }
        });
    return $qr;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    valueFabric,
    valueQr,
    valueFabrics,
}