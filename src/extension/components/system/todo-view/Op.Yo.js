import Ex from "ex";
import Ux from "ux";

const yoRecord = (reference) => {
    const code = Ex.toModelId(reference, "form");
    const attrs = {};
    attrs.$name = code;
    const $inited = Ux.ambiguityItem(reference, "$inited");
    const {record = {}, data = {}} = $inited;
    /*
     * 数据信息
     */
    const $data = {};
    Object.assign($data, record);
    Object.assign($data, data);
    attrs.data = $data;
    return attrs;
};
const yoLeft = (reference = {}) => {
    let leftVisible = true;
    const {$inited = {}} = reference.state ? reference.state : {};
    if ("FINISHED" === $inited.status) {
        leftVisible = false;
    }
    return leftVisible;
};
const yoHistory = (reference) => {
    const $inited = Ux.ambiguityItem(reference, "$inited");
    const {activity = {}, changes = []} = $inited;
    const $data = {};
    Object.assign($data, activity);
    $data.items = Ux.clone(changes);
    const attrs = {};
    attrs.data = $data;
    return attrs;
};
export default {
    yoLeft,
    yoRecord,
    yoHistory,
}