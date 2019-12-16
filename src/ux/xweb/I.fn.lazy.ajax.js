import E from "../error";
import Eng from "../engine";
import Abs from '../abyss';

export default (reference, config = {}) => {
    // 必须保证ajax参数信息
    E.fxTerminal(!config.ajax, 10053, config);
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
                request.criteria = Eng.parseInput(ajaxRef.params.criteria, ref);
                return request;
            } else {
                return Eng.parseInput(ajaxRef.magic, ref);
            }
        }
    }
};