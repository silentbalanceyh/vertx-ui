import __Rdx from './source.fn.write.redux';
import __On from './source.datum.fn.on.consumer';
import __Zn from './zero.module.dependency';

const assistIn = (reference, key, data) => {
    const combine = __On.onSave(reference, key, data);
    if (combine) {
        const state = {};
        state[`assist.${key}`] = combine;
        __Rdx.writeTree(reference, state);
    }
}
const assistOut = (reference, key, data) => {
    const combine = __On.onSave(reference, key, data, true);
    if (combine) {
        const state = {};
        state[`assist.${key}`] = combine;
        __Rdx.writeTree(reference, state);
    }
}
const writeAssist = (reference, key, data = {}, isDeleted = false) => {
    const saved = __On.onSave(reference, key, data, isDeleted);
    if (saved && __Zn.isArray(saved)) {
        const assist = {};
        assist[`assist.${key}`] = saved;
        __Rdx.writeTree(reference, assist);
    }
};
export default {
    assistIn,
    assistOut,
    writeAssist,
}