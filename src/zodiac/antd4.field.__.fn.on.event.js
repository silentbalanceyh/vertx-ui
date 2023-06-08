import __Zn from './zero.module.dependency';
import __FORM from './form.fn.form.action';
import __DEP from './form.fn.write.dependency';

const onSelect = (jsx = {}, fnSelect) => {
    if (__Zn.isFunction(fnSelect)) {
        jsx.onSelect = fnSelect;
    }
};


// I.fn.change.js
const onChange = (rest = {}, fnChange, jsx = {}) => {
    const {
        reference,
        options = [],
        config = {},        // 默认是 {}
        depend,
        prevent = true
    } = jsx;
    /*
     * 一定会包含 onChange 参数，信任内部的 native code 的相关处理
     * 1）fnChange：通过编程写的外部传入的 change 函数
     * 2）onChange：默认的，zero ui 中的特殊 onChange
     * -- 处理 linker
     * -- 处理 impact 两个节点
     * 3）是否包含了 reference 引用信息
     * -- 自定义的一定包含 reference
     * -- 非自定义的一定不包含 reference
     */
    rest.onChange = (event) => {
        /*
         * 二义性函数处理值信息，直接带 prevent 读取
         * 带 prevent 是防止一些特殊的 prevent 被取消
         */
        const value = __Zn.ambEvent(event, {prevent});
        const formValues = {};
        if (config.linker) {
            /*
             * linker 专用处理，配置项
             * optionJsx.config.linker
             * optionJsx.config.linkerField
             */
            __DEP.writeLinker(formValues, config, (field) => {
                return __Zn.elementUnique(options, field, value);
            });
        }
        if (depend) {
            const {impact = {}} = depend;
            if (__Zn.isObject(impact) && !__Zn.isEmpty(impact)) {
                /*
                 * depend 专用处理格式如下：
                 * optionJsx.depend.impact
                 * {
                 *      "reset": [
                 *      ],
                 *      "duration": {
                 *          "start": "from",
                 *          "end": "to",
                 *          "type": "Number | Moment | Decimal"
                 *      }
                 * }
                 */
                const configuration = {};
                configuration.config = __Zn.clone(impact);
                configuration.reference = reference;
                __DEP.writeImpact(formValues, configuration, value);
            }
        }
        /*
         * reference 存在才执行 form 逻辑
         */
        if (reference) {
            /*
             * 不为空就设值
             */
            if (!__Zn.isEmpty(formValues)) {
                __Zn.dgDebug(formValues, "[ Ux ] depend.impact / linker 结果！");
                __FORM.formHits(reference, formValues);
                // FormUp: 触发 linker / depend.impact 需刷新界面
                __Zn.of(reference).up().done();
            }
        }
        if (__Zn.isFunction(fnChange)) {
            fnChange(event, value, reference);
        }
    }
}
export default {
    onSelect,
    onChange,
}