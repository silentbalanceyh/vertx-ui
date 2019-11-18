import Ex from "ex";
import Ux from "ux";
import U from 'underscore';

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
const yoRelation = (reference) => {
    const $inited = Ux.ambiguityItem(reference, "$inited");
    const {data = {}} = $inited;
    const $data = {};
    if (U.isArray(data['downstreams'])) {
        $data.down = data['downstreams'];
    } else {
        $data.down = [];
    }
    if (U.isArray(data['upstreams'])) {
        $data.up = data['upstreams'];
    } else {
        $data.up = [];
    }
    const attrs = {};
    attrs.data = $data;
    /*
     * 配置处理
     */
    const configuration = Ux.fromPath(reference, "module", "configuration", "tabRelation");
    if (configuration) {
        attrs.config = configuration;
    }
    /*
     * 设置 current 变量
     */
    const current = {};
    current.identifier = $inited['modelId'];
    current.name = data.name;
    current.code = data.code;
    if ($inited['modelCategory']) {
        const category = Ux.elementUniqueDatum(reference, "data.category", "key", $inited['modelCategory']);
        if (category) {
            current.category = category.name;
        }
    }
    attrs.current = Ux.valueValid(current);
    return attrs;
};
export default {
    yoLeft,
    yoRecord,
    yoHistory,
    yoRelation,
}