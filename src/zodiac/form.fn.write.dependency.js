import __Zn from './zero.module.dependency';
import moment from 'moment';
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
    if (!__Zn.isEmpty(linker)) {
        /*
         * 输入源头读取
         */
        const linkerSource = __Zn.isFunction(rowSupplier) ? rowSupplier(linkerField) : {};
        if (linkerSource) {
            /*
             * 使用Linker设置最终值
             */
            Object.keys(linker)
                .filter(field => !!field)                               // field 必须存在
                .filter(field => !!linker[field])                       // linker 中定义了 field
                // .filter(field => linkerSource.hasOwnProperty(field))    // 不包含就直接 undefined
                .forEach(field => {
                    const formField = linker[field];
                    let value = linkerSource[field];
                    /*
                     * 日期值处理
                     */
                    if (linkerDate.hasOwnProperty(field)) {
                        const pattern = linkerDate[field];              // 是否有日期
                        if (value) {
                            const formatted = moment(value, pattern);       // 执行日期格式化
                            if (moment.isMoment(formatted)) {
                                value = formatted;
                            } else {
                                value = null;   // Fix issue of Moment
                            }
                        } else {
                            value = null;
                        }
                    }
                    formValues[formField] = value;                      // linker 赋值
                });
            __Zn.dgDebug({linker, formValues}, "触发 linker 结果！", "#104E8B");
        }
    }
    return formValues;
};
export default {
    writeImpact,
    writeLinker,
}