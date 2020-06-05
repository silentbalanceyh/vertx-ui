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
        const value = Ele.ambEvent(event, {prevent});
        const formValues = {};
        if (config.linker) {
            /*
             * linker 专用处理，配置项
             * optionJsx.config.linker
             * optionJsx.config.linkerField
             */
            Ut.writeLinker(formValues, config,
                (field) => Ele.elementUnique(options, field, value));
        }
        if (depend) {
            const {impact = {}} = depend;
            if (Abs.isObject(impact) && !Abs.isEmpty(impact)) {
                /*
                 * depend 专用处理
                 * optionJsx.depend.impact
                 */
                Ut.writeImpact(formValues, depend, value);
            }
        }
        /*
         * reference 存在才执行 form 逻辑
         */
        if (reference) {
            /*
             * 不为空就设值
             */
            if (!Abs.isEmpty(formValues)) {
                Dev.dgDebug(formValues, "[ Ux ] depend.impact / linker 结果！");
                Ut.formHits(reference, formValues);
            }
        }
        if (U.isFunction(fnChange)) {
            fnChange(event, value, reference);
        }
    }
}