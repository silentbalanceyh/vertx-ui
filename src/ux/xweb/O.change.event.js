import U from "underscore";
import Event from './O.event';
import moment from "moment";

import Ut from '../element';
import Abs from '../abyss';
import Eng from "../engine";
import Ajax from "../ajax";

const _xtValue = (input, normalize = data => data) => {
    let value = undefined;
    if (input && U.isFunction(input.preventDefault)) {
        input.preventDefault();
        value = input['target'] ? input['target'].value : undefined;
    } else {
        // 时间格式专用处理
        if (moment.isMoment(input)) {
            value = input.toISOString();
        } else {
            value = input;
        }
    }
    return normalize(value);
};
/**
 * ## 标准函数
 *
 * 表格编辑器专用
 *
 * @memberOf module:_xt
 * @deprecated 后续使用表格编辑器时再考虑要不要删除。
 */
const xtOrigin = (origin = {}, response = {}, root, key) => {
    if (root && key) {
        let data = [];
        if (U.isArray(response)) {
            data = Abs.clone(response);
        } else {
            if (U.isArray(response.list)) {
                data = Abs.clone(response.list);
            }
        }
        // 两层结构，防止清除的情况发生，需要从origin中取上一次的基础数据
        const calculated = origin[root] ? origin[root] : {};
        calculated[key] = data;
        origin[root] = calculated;
    }
    return Abs.clone(origin);
};
const _xtOrigin = (reference, response = {}, root, key) => {
    const {origin = {}} = reference.state;
    return xtOrigin(origin, response, root, key);
};
const xt2ChangeUnitSync = (event, reference, {
    index, field, key = "data",
    normalize = data => data,
    origin
}) => {
    const value = _xtValue(event, normalize);
    // 1.读取数据源 source为默认值
    let source = reference.state ? reference.state[key] : [];
    if (U.isArray(source)) {
        // 2.新处理数据源，取得新的key值
        if (!source[index]) {
            source[index] = {key: Ut.randomUUID()};
        }
        source[index][field] = value;
    }
    source = Abs.clone(source);
    // 3.状态更新
    const state = {};
    state[key] = source;
    // 4.如果存在addon则将addon合并到state中
    if (origin) state.origin = origin;
    reference.setState(state);
    // 4.调用本地的onChange
    Event.xtChange(reference, source, key);
};
const xt2ChangeUnitAsync = (event, reference, {
    index, field, key = "data",
    normalize = data => data,
    trigger, record = {}
}) => {
    // 这里的record只能用原来的，此处需要补充最新的数据到Ajax触发参数中
    const value = _xtValue(event, normalize);
    record = Abs.clone(record);
    record[field] = value;
    // 异步Trigger处理
    xtCallback(reference, trigger, record, (response = {}) => {
        // 1.修改源头
        const to = trigger.to;
        // 2.新状态，更新最新的数据源
        const origin = _xtOrigin(reference, response, to, record.key);
        // 3.更新状态
        xt2ChangeUnitSync(event, reference, {
            index, field, key, normalize, origin
        });
    });
};
const xt2ChangeUnit = (reference, params = {}) => (event) => {
    const {trigger} = params;
    if (trigger) {
        // 异步更改
        xt2ChangeUnitAsync(event, reference, params);
    } else {
        // 同步更改
        xt2ChangeUnitSync(event, reference, params);
    }
};
const xt3ChangeUnit = (reference, {
    field, key = "data",
    normalize = data => data,
    trigger,
}) => (
    index, // 当前索引值，根据索引构造，三阶函数
    record = {} // 当前记录专用信息
) => xt2ChangeUnit(reference, {
    index,      // 当前行的索引
    field,      // 当前字段名
    key,        // 状态专用字段键值
    normalize,  // 是否执行格式化normalize
    trigger,    // Ajax触发器配置
    record      // 当前行记录/表单记录：record
});
const _mockData = (reference, trigger = {}) => {
    let mockData = {};
    if (trigger.mock) {
        const ref = Eng.onReference(reference, 1);
        if (ref) {
            const {mock = {}} = ref.state ? ref.state : {};
            mockData = mock[trigger.mock];
        }
    }
    return mockData;
};

const xtCallback = (reference, trigger = {}, record = {}, fnCallback) => {
    // 读取Mock数据
    const mockData = _mockData(reference, trigger);
    // 处理专用
    Ajax.asyncData(trigger.ajax, record, fnCallback, mockData);
};
export default {
    // 核心列变更事件
    xtOrigin,
};