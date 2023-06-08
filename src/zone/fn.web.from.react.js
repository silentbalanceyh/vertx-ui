import __E from './fn.debug.fx.error';
import __A from './fn.atomic.foundation';
import __Amb from './fn.assemble.amb.polysemy';
import __Fw from './fn.web.on.react';

const fromHoc = (reference = {}, key = "", level = 0) => {
    __E.fxTerminal("string" !== typeof key, 10000, "string", typeof key);
    const ref = __Fw.onReference(reference, level);
    if (ref) {
        const {$hoc} = ref.state ? ref.state : {};
        return ($hoc) ? $hoc._(key) : null;
    } else {
        console.error("传入第一个参数 reference 为 null 或 undefined");
    }
};
const fromPath = (reference = {}, ...args) => {
    let keys = __Amb.ambArray.apply(this, args);
    const length = keys['length'];
    __E.fxTerminal(1 > length, 10070, keys, 1);
    let data = fromHoc(reference, keys[0]);
    if (1 < length && data) {
        const path = [];
        [].concat(keys).forEach((item, index) => {
            if (0 < index) {
                path.push(item);
            }
        });
        const $data = __A.immutable(data);
        data = $data.getIn(path);
        if (data && data.toJS) {
            data = data.toJS();
        }
    }
    return data;
};
export default {
    fromHoc,
    fromPath,
}