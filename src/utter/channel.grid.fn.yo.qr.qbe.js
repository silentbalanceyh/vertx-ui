import Ux from 'ux';
import yoAmbient from './channel.@fn.yo.ambient';
import Fn from './idyl.zero.dependency';

const yoQrQBE = (reference) => {
    const inherits = yoAmbient(reference);
    const {
        $qbeQr,
        $qbe,
    } = reference.state;
    if ($qbeQr) {
        inherits.data = $qbeQr;
        inherits.value = $qbe;      // Running
        inherits.rxQBE = Fn.rxQrQBE(reference);
    }
    return inherits;
}
const yoQrCond = (reference, config = {}) => {
    const inherits = yoAmbient(reference);
    const {field, ...configuration} = config;
    const {$qr = {}} = reference.state;
    inherits.config = Ux.clone(configuration);
    // $qr.value extraction
    inherits.value = $qr[field];
    inherits.rxQr = Fn.rxQr(reference, config);
    return inherits;
}
const yoQrTag = (reference, config = {}) => {
    const inherits = yoAmbient(reference);
    inherits.config = config;
    inherits.rxClean = Fn.rxQrClean(reference, config);
    const {$qr = {}} = reference.state;
    inherits.value = $qr;
    return inherits;
}
export default {
    yoQrCond,
    yoQrTag,
    yoQrQBE,
}