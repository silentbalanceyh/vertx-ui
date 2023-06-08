import Ux from 'ux';

const dataQr = (reference, value = []) => {
    const {$keyword} = reference.state;
    if ($keyword) {
        const condition = {};
        if (0 < value.length) {
            condition[`${$keyword},>=`] = value[0].toISOString();
            condition[`${$keyword},<=`] = value[1].toISOString();
            condition[""] = true;
        } else {
            condition[`${$keyword},>=`] = Ux.Env.CV_DELETE;
            condition[`${$keyword},<=`] = Ux.Env.CV_DELETE;
        }
        return {
            condition,
            value,
        }
    } else {
        console.error("错误！配置")
    }
}
const rxOk = (reference) => (event = []) => {
    const query = dataQr(reference, event);
    Ux.fn(reference).rxQr(query, true);
}
const rxClean = (reference) => (event) => {
    const query = dataQr(reference, event);
    Ux.fn(reference).rxQr(query, false);
}
export default {
    rxOk,
    rxClean,
}