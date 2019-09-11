import U from "underscore";
import Ele from '../../element';
import Abs from '../../abyss';
import Ut from '../../unity';
import Dev from '../../develop';

export default (rest = {}, jsx = {}, fnChange) => {
    const {
        reference,
        options = [],
        config = {},        // 默认是 {}
        trigger,
        prevent = true
    } = jsx;
    if (reference) {
        /*
         * 只有 reference 存在的时候才考虑配置
         */
        rest.onChange = (event) => {
            /*
             * 使用二义性函数处理值
             */
            const value = Ele.ambiguityEvent(event, {prevent});
            /*
             * linker 专用处理，配置项
             * optionJsx.config.linker
             * optionJsx.config.linkerField
             */
            const formValues = {};

            const {linker = {}, linkerField = "key"} = config;
            if (!Abs.isEmpty(linker)) {
                const row = Ele.elementUnique(options, linkerField, value);
                if (row) {
                    const formValues = {};
                    Object.keys(linker)
                        .filter(rowField => !!rowField)    // rowField 存在
                        .forEach(rowField => {
                            const formField = linker[rowField];
                            if (formField) {
                                formValues[formField] = row[rowField];
                            }
                        });
                }
            }
            /*
             * depend 专用处理
             * optionJsx.depend.impact
             */
            if (trigger && Abs.isObject(trigger['impact'])) {
                const expected = trigger['impact'];
                let values;
                if ("boolean" === typeof value) {
                    values = expected[String(value)];
                } else {
                    values = expected[value];
                }
                Object.assign(formValues, values);
            }
            /*
             * 不为空就设值
             */
            if (!Abs.isEmpty(formValues)) {
                Dev.dgDebug(formValues, "[ Ux ] trigger.impact / linker 结果！");
                Ut.formHits(reference, formValues);
            }
            /*
             * 最后调用 fnChange
             */
            if (U.isFunction(fnChange)) {
                fnChange(event);
            }
        }
    } else {
        if (U.isFunction(fnChange)) {
            /*
             * 直接传递：直接将 fnChange 传入给 onChange
             */
            rest.onChange = fnChange;
        }
        /*
         * 另外的一个分支下 onChange 属性不存在，这里不注入任何和 onChange 相关的内容
         * *：后期可以考虑从这里扩展处理相关内容，保证
         */
    }
}