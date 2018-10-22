import U from "underscore";
import Util from "../util";

const xtInitObject = (props = {}) => {
    const values = {};
    const value = props.value;
    if (value) {
        values.data = value;
    } else {
        // 默认对象
        values.data = {};
    }
    return values;
};

/**
 * 初始化专用方法
 * @param props
 */
const xtInit = (props = {}) => (props.value || {});
const xtInitArray = (props = {}, empty = false) => {
    const values = {};
    // 初始化处理
    const value = props.value;
    if (value) {
        values.data = U.isArray(value) ? value : (U.isArray(value.data) ? value.data :
            ((empty) ? [] : [{key: Util.randomUUID()}]));
    } else {
        values.data = ((empty) ? [] : [{key: Util.randomUUID()}]);
    }
    return values;
};
/**
 * 默认两条记录
 * @param props
 * @param records
 */
const xtInitSource = (props = {}, records = 2) => {
    const {source = []} = props;
    const keys = source.map(item => item.key);
    const state = {};
    keys.forEach(key => {
        let item = [];
        for (let idx = 0; idx < records; idx++) {
            item.push({key: Util.randomUUID()});
        }
        state[key] = item;
    });
    // initSource的核心，就是包含了一个dataSource节点
    return {dataSource: state};
};
export default {
    xtInitSource,
    xtInitArray,
    xtInit,
    xtInitObject
};