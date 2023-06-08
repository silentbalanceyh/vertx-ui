import Ux from "ux";

// 根据 source 把对应的 Id 算计出来控制 实体字段 字段的下拉
const source = (reference = {}) => (event) => {
    const found = Ux.elementUniqueDatum(reference, 'resource.entities', 'identifier', event);
    if (found) {
        Ux.formHit(reference, "entityId", found.key);
    }
};
export default {
    source,
}