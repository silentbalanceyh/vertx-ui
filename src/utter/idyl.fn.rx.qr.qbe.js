import Ux from 'ux';

const rxQrQBE = (reference) => ($qbe, reset = false) => {
    const state = {};
    state.$qbe = $qbe;
    state.$qbeOk = true;
    if (reset) {
        state.$qbeDefault = $qbe;
    }
    state.$refresh = Ux.randomString(16);

    Ux.of(reference).in(state).done();
    // reference.?etState(state);
};
const rxQrClean = (reference) => (field) => {
    const state = {};
    if (!field) {
        state.$qr = {};
    } else {
        let {$qr = {}} = reference.state;
        $qr = Ux.clone($qr);
        if ($qr.hasOwnProperty(field)) {
            delete $qr[field];
        }
        state.$qr = $qr;
    }
    state.$refresh = Ux.randomString(16);
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
    // reference.?etState(state);
}
const rxQr = (reference, config = {}) => (request = {}, refresh = false) => {
    const {field} = config;
    if (!field) {
        throw Error("对不起，配置出错，请提供 field！")
    }
    /*
     * $qr = {
     *     condition,
     *     value
     * }
     */
    let {
        $qr = {},
        $queryDefault = {},
    } = reference.state;
    $qr = Ux.clone($qr);
    $qr[field] = request;
    const state = {};
    state.$qr = $qr;

    /*
     * $queryDefault + $qr -> $query
     * $query variable building
     */
    const conditions = Object.keys($qr)
        .map(field => $qr[field])
        .filter(item => !!item.condition)
        .map(item => item.condition);
    let $query = Ux.clone($queryDefault);
    conditions.forEach(each => $query = Ux.qrAndQH(reference, $query, each));
    state.$query = $query;

    if (refresh) {
        state.$refresh = Ux.randomString(16);
    }
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
}
export default {
    rxQrClean,
    rxQrQBE,
    rxQr,
}

