import Ux from 'ux';
import {Dsl} from 'entity';

const rxAssist = (reference) => (key, data, deleted = false) => {
    const saved = Ux.onSave(reference, key, data, deleted);
    if (saved && Ux.isArray(saved)) {
        /* 写 $a_<key> 专用 */
        const $key = Ux.toKey(key);
        const state = {};
        state[$key] = Dsl.getArray(saved);
        return Ux.of(reference).in(state)
            .future(() => Ux.promise(saved));
        // reference.?etState(state);
    } else {
        return Ux.promise(saved);
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    rxAssist
}