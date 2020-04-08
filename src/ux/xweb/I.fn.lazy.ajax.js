import E from "../error";
import Eng from "../engine";
import Abs from '../abyss';

/**
 * ## 标准函数
 *
 * 根据 config 中的 ajax 配置，来执行参数解析，主要用于可执行 Ajax的延迟请求控件，如：
 *
 * * ListSelector
 * * AddressSelector
 * * TreeSelector
 *
 * 上述控件都是复杂的自定义控件，必须解析 ajax 配置执行延迟远程调用。
 *
 * @memberOf module:_xt
 * @method xtLazyAjax
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} config Ajax配置专用配置信息。
 * @return {Object} 返回参数信息。
 */
export default (reference, config = {}) => {
    // 必须保证ajax参数信息
    E.fxTerminal(!config.ajax, 10053, config);
    config = Abs.clone(config);     // 拷贝防止变更，防止页码记忆
    if (config.ajax) {
        /**
         * 读取上层引用，这里是ListSelector中对应的Form本身
         * 所以上层引用才会是reference
         */
        const ref = Eng.onReference(reference, 1);
        E.fxTerminal(!ref, 10079, ref);
        if (ref) {
            const ajaxRef = config.ajax;
            if (Abs.isQr(config)) {
                const request = {};
                if (!ajaxRef.params) ajaxRef.params = {};
                /*
                 * 拷贝 sorter / pager
                 */
                Object.assign(request, ajaxRef.params);
                request.criteria = Eng.parseInput(ajaxRef.params.criteria, ref);
                return request;
            } else {
                return Eng.parseInput(ajaxRef.magic, ref);
            }
        }
    }
};