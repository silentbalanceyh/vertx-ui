import Ux from "ux";

const yiModel = (reference) => {
    const assert = Ux.fromHoc(reference, "assist");
    Ux.asyncAssist(assert, reference, {})
        .then(Ux.ready).then(Ux.pipe(reference))
}
const rxTree = (reference) => (keys = []) => {
    const key = keys[0];
    if (key) {
        const record = Ux.elementUniqueDatum(reference, "model.information", 'key', key);
        if (record) {
            // rxSelect
            Ux.fn(reference).rxTree(record);
        }
    }
}
export default {
    yiModel,
    rxTree
}