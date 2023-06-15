import __Zn from './zero.module.dependency';
import __IMT from './antd4.__.v.field.impact';

const writeImpact = (formValues = {}, configuration = {}, value) => {
    const {
        config = {},        // 原 optionJsx.depend.impact 配置
        reference,          // 原组件引用 reference
    } = configuration;
    /*
     * 读取 impact
     */
    const extract = {};
    extract.reference = reference;
    extract.value = value;
    __IMT.rules
        .filter(rule => config.hasOwnProperty(rule))
        .filter(rule => __Zn.isFunction(__IMT.ruler[rule]))
        .forEach(rule => {
            const each = __Zn.clone(extract);
            each.config = __Zn.clone(config[rule]);
            // executor
            const executor = __IMT.ruler[rule];
            executor(formValues, each);
        });
};
const writeLinker = (formValues = {}, config = {}, rowSupplier) => {
    const {linker = {}, linkerField = "key", linkerDate = {}} = config;
    // 截断
    if (__Zn.isEmpty(linker)) {
        return formValues;
    }
    // 截断：输入源头提取，输入源头从第三个函数 rowSupplier 中提取
    const linkerSource = __Zn.isFunction(rowSupplier) ? rowSupplier(linkerField) : {};
    if (!linkerSource) {
        return formValues;
    }

    // eslint-disable-next-line no-whitespace-before-property
    Object.keys(linker)
        /* field 必须存在 */ .filter(field => !!field)
        /* linker 中定义了 field */ .filter(field => !!linker[field])
        .forEach(field => {
            const formField = linker[field];
            let value = linkerSource[field];

            // 第二配置：日期格式化
            if (linkerDate.hasOwnProperty(field)) {
                const pattern = linkerDate[field];              // 是否有日期
                if (value) {
                    const formatted = __Zn.valueDatetime(value, pattern);
                    if (__Zn.isMoment(formatted)) {
                        value = formatted;
                    } else {
                        value = null;
                    }
                } else {
                    value = null;
                }
            }
            formValues[formField] = value;                      // linker 赋值
        });
    __Zn.dgDebug({linker, formValues}, "触发 linker 结果！", "#104E8B");
    return formValues;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    writeImpact,
    writeLinker,
}