import __Zn from './zero.module.dependency';
import __Fr from './antd4.fn.v4.patch';
import __FORM from './form.fn.form.action';
import __DATUM_CONSUMER from './source.datum.fn.on.consumer';

const Cv = __Zn.Env;
const __v4DependencyRule = (vExpected, vActual, reference) => {
    if (__Zn.isArray(vExpected)) {
        // 期望值是数组
        if (__Zn.isArray(vActual)) {
            // 双数组对比
            return __Zn.elementInAny(vActual, vExpected);
        } else {
            // 单值对比
            return vExpected.includes(vActual);
        }
    } else if (__Zn.isObject(vExpected)) {
        /*
         * 特殊配置，用于处理 DATUM 下拉
         * {
         *     "source": "surety.type",
         *     "field": "code",
         *     "value": "None"
         * }
         */
        if (vExpected.source || vExpected.field) {
            const dataArray = __DATUM_CONSUMER.onDatum(reference, vExpected.source);
            const $values = __Zn.ambArray(vExpected.value);
            return dataArray
                .filter(each => undefined !== each[vExpected.field])
                .filter(each => $values.includes(each[vExpected.field]))
                .map(each => each.key).includes(vActual);
        } else {
            // 不满足，直接不禁用
            return false;
        }
    } else {
        // 单独值
        if (false === vExpected) {
            // undefined / false 都转换为 false
            return undefined === vActual || false === vActual;
        } else if ("VALUE" === vExpected) {
            // 必须有值
            return undefined !== vActual;
        } else {
            // 实际值和期望值相等
            return vActual === vExpected;
        }
    }
}
// Fix: https://e.gitee.com/wei-code/issues/table?issue=I6VOZW
const __v4DependencyValue = (optionJsx, reference, config = {}) => {
    const fields = Object.keys(config);
    let values = {};
    {
        const form = __Fr.v4FormRef(reference);
        if (form) {
            values = __FORM.formGet(reference, fields);
        }
        if (__Zn.isEmpty(values)) {
            const source = optionJsx[Cv.K_NAME._DATA_SOURCE];
            values = __Zn.valueOk(source, fields);
        }
    }
    return values;
}

const __v4Dependency = (optionJsx = {}, reference) => {
    const {depend = {}} = optionJsx;
    const {mode = "DISABLED"} = __Zn.clone(depend);
    if ("DISABLED" === mode) {
        const {enabled = {}} = depend;
        /*
         * 计算 disabled 的基本规则
         * 1）enabled 作为 key
         * 2）数据结构：
         * {
         *      "field": "value" // 等于
         *      "field": ["xxx"] // 包含
         * }
         */
        if (__Zn.isObject(enabled) && !__Zn.isEmpty(enabled)) {
            const config = __Zn.clone(enabled);
            // 先提取值
            const fields = Object.keys(config);
            const values = __v4DependencyValue(optionJsx, reference, config);
            const counter = fields.map(field => {
                const vExpected = config[field];
                const vActual = values[field];
                return __v4DependencyRule(vExpected, vActual, reference);
            }).filter(checked => false === checked).length;
            /*
             * counter = 0：全部验证通过，disabled = false
             * counter > 0：有内容未通过，disabled = true;
             */
            optionJsx.disabled = 0 < counter;
        } else {
            // 不禁用
            optionJsx.disabled = false;
        }
    }
    // else if ("READONLY" === mode) {
    //
    // }
}

const __v4Edition = (optionJsx, reference, field) => {
    /*
     * 优先从 reference.props 中读取 $edition
     */
    let $edition = {};
    if (reference.props.hasOwnProperty("$edition")) {
        /*
         * 属性中包含了，则证明定制过，那么取属性中的
         */
        const propEdition = reference.props.$edition;
        if (__Zn.isObject(propEdition)) {
            Object.assign($edition, propEdition);
        } else {
            $edition = propEdition;
        }
    }
    if (false === $edition) {
        /* 不可编辑，直接切断 */
        return $edition;
    }
    /* state 中的优先级高于 props 中 */
    if (reference.state.hasOwnProperty("$edition")) {
        const stateEdition = reference.state.$edition;
        if (__Zn.isObject(stateEdition)) {
            Object.assign($edition, stateEdition);
        }
    }
    if (false === $edition) {
        /* 不可编辑，直接切断 */
        return $edition;
    }
    const {$inited = {}} = reference.props;
    const {metadata} = $inited;

    /* state 中的优先级高于 props 中 */
    if (!__Zn.isEmpty(metadata)) {
        if (__Zn.isObject(metadata) && metadata.hasOwnProperty("edition")) {
            if (metadata.edition) {
                $edition = {};
            } else {
                $edition = false;
            }
        }
    }
    if (false === $edition) {
        /* 不可编辑，直接切断 */
        return $edition;
    }
    /* 如果当前字段为可编辑 */
    if (false !== $edition[field]) {
        const {config = {}} = optionJsx;
        if (config.once) {
            const value = $inited[field];
            /*
             * 不可编辑的判断
             * 1. undefined 的时候不可编辑
             * 2. "" 空字符串的时候也不可编辑
             **/
            if (__Zn.isValid(value)) {
                /* 不可编辑 */
                $edition[field] = false;
            }
        }
    }
    /* 权限控制，field 为 undefined 是 $button 按钮专用 */
    if ($edition && $edition.__acl) {
        if (!optionJsx.readOnly && field) {
            // 非只读的情况，才考虑 __acl
            $edition[field] = $edition.__acl[field];
        }
    }
    /* 追加 optionJsx.config.linker */
    return $edition;
}

const __v4ReadOnly = (optionJsx, reference, field) => {
    /*
     * 验证之前计算，计算 disabled / readOnly
     * 新版虽然有 dependencies，貌似无法处理带条件的部分
     */
    if (optionJsx.readOnly) {
        // 跳过 readOnly 字段
        return;
    }
    const edition = __v4Edition(optionJsx, reference, field);
    if (edition && __Zn.isObject(edition)) {
        /*
         * 部分表单禁用
         */
        if (edition.hasOwnProperty(field)) {
            optionJsx.readOnly = !edition[field];
        }
    } else {
        /*
         * 直接禁用（全表单禁用）
         */
        optionJsx.readOnly = true;
    }
}
export default (values = {}, configuration = {}) => {
    const {
        reference,
        cell,
    } = configuration;
    // 不可能 undefined
    const optionJsx = __Zn.clone(cell.optionJsx ? cell.optionJsx : {});
    if (!optionJsx.config) optionJsx.config = {};
    /*
     * 先修正值（后期计算 disabled 这里会需要）
     * Cv.K_NAME._DATA_SOURCE
     * Cv.K_NAME._DATA_FIELD
     * Cv.K_NAME._DATA_INITIAL
     * 解决某些场景无法赋值的情况
     */
    optionJsx[Cv.K_NAME._DATA_SOURCE] = values;
    optionJsx[Cv.K_NAME._DATA_FIELD] = cell.field;
    if (values.hasOwnProperty(cell.field)) {
        optionJsx[Cv.K_NAME._DATA_INITIAL] = values[cell.field];
    }
    /* 先计算 disabled */
    __v4Dependency(optionJsx, reference);
    /* 再计算 readOnly */
    __v4ReadOnly(optionJsx, reference, cell.field);
    return optionJsx;
}