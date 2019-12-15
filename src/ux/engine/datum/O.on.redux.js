import On from "./O.on";
import T from '../../unity';

const writeAssist = (reference, key, data = {}, isDeleted = false) => {
    const saved = On.onSave(reference, key, data, isDeleted);
    const assist = {};
    assist[`assist.${key}`] = saved;
    T.writeTree(reference, assist)
};
export default {
    writeAssist
}