import E from "../error";
import Eng from "../engine";
import Abs from '../abyss';

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