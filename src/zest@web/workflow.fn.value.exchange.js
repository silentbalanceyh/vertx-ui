import __Zn from './zero.module.dependency';
import __Fm from './form.submit.fn.data.io';

const valueTran = (params = {}, data, reference) => {
    const normalized = {};
    if ("string" === typeof data) {
        // 格式1：不可能包含内置解析部分
        const pairs = data.split(",");
        pairs.forEach(expr => {
            const kv = expr.split("=");
            const field = kv[0];
            let value = kv[1];
            if (field && value) {
                const vt = value.split(":");
                if (1 === vt.length) {
                    // <VALUE>
                    value = vt[0];
                } else if (2 === vt.length) {
                    // <VALUE>:<TYPE>
                    value = __Zn.valueT(vt[0], vt[1]);
                }
                normalized[field] = value;
            }
        })
    } else if (__Zn.isArray(data)) {
        // 格式2：数组类型
        // -- 元素为字符串：   递归格式1
        // -- 元素为对象：     递归格式2
        // -- 元素为数组：     递归格式3
        data.forEach(each => {
            const element = valueTran(params, each, reference);
            Object.assign(normalized, element);
        })
    } else if (__Zn.isObject(data)) {
        const {inSource} = data;
        if (inSource) {
            // 格式3：可解析
            // 可解析的格式必须包含 inSource 字段
            const {inField, ...inRest} = data;
            normalized[inField] = __Fm.dataIo(params, inRest, reference);
        } else {
            // 格式4：普通对象
            // 专用合并，无 inSource 模式
            // 即使无 inSource 模式，但在配置过程中依旧会执行内置解析
            const nested = {};
            Object.keys(data).forEach(field => {
                if (__Zn.isObject(data[field])) {
                    const config = {
                        ...data[field],
                        inField: field,
                    };
                    const element = valueTran(params, config, reference);
                    Object.assign(normalized, element);
                } else {
                    const exprValue = data[field];
                    if ("string" === typeof exprValue && exprValue.startsWith("FORM")) {
                        const exprField = exprValue.split(":")[1];
                        nested[field] = params[exprField];
                    } else {
                        nested[field] = data[field];
                    }
                }
            })
            Object.assign(normalized, nested);
        }
    }
    return normalized;
}
const valueIndicate = (params = {}, config = {}, reference) => {
    /*
     * indicator 有三种值格式：
     * 1）（无值）：不执行任何规则，直接对 data 执行赋值，最简单配置。
     * 2）字符串：执行单一判断规则，根据一个指示变量执行最终数据拼合。
     * 3）数组：执行多判断规则，底层规则会追加上层内容，如两个规则同时更改某一个字段值：
     * -- RULE1, phase1
     * -- RULE2, phase2（没有phase1字段时phase2才生效）
     */
    const {
        indicator,
        data,
    } = config;
    let nData = {};
    if (indicator) {
        if (__Zn.isArray(indicator)) {
            const keyArray = [];
            indicator.forEach(keyF => {
                const key1 = __Zn.valueT(params[keyF]);
                keyArray.push(key1);
            });
            const key = keyArray.join("/");
            const dataPart = data[key];
            if (dataPart) {
                // 计算后提取 data
                nData = valueTran(params, dataPart, reference);
            }
        } else if ("string" === typeof indicator) {
            const key = __Zn.valueT(params[indicator]);
            const dataPart = data[key];
            if (dataPart) {
                // 计算后提取 data
                nData = valueTran(params, dataPart, reference);
            }
        } else {
            // 直接提取 data
            nData = valueTran(params, data, reference);
        }
    } else {
        // 直接提取 data 节点的值
        nData = valueTran(params, data, reference);
    }
    __Zn.dgDebug(nData, "[NData] Indicator 翻译结果", "#0093ed");
    return nData;
}
export default {
    valueTran,
    valueIndicate,
}