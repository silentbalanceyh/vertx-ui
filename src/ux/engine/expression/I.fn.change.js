import U from "underscore";
import Ele from '../../element';
import Abs from '../../abyss';
import Ut from '../../unity';
import Dev from '../../develop';

export default (rest = {}, fnChange, jsx = {}) => {
    const {
        reference,
        options = [],
        config = {},        // 默认是 {}
        depend,
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
            const value = Ele.ambEvent(event, {prevent});
            /*
             * linker 专用处理，配置项
             * optionJsx.config.linker
             * optionJsx.config.linkerField
             */
            const formValues = {};
            Ut.writeLinker(formValues, config,
                (field) => Ele.elementUnique(options, field, value));
            /*
             * depend 专用处理
             * optionJsx.depend.impact
             */
            Ut.writeImpact(formValues, depend, value);
            /*
             * 不为空就设值
             */
            if (!Abs.isEmpty(formValues)) {
                Dev.dgDebug(formValues, "[ Ux ] depend.impact / linker 结果！");
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