import Ux from 'ux';

const parseParams = (reference, config = {}) => {
    // 必须保证ajax参数信息
    Ux.E.fxTerminal(!config.ajax, 10053, config);
    if (config.ajax) {
        /**
         * 读取上层引用，这里是ListSelector中对应的Form本身
         * 所以上层引用才会是reference
         */
        const ref = Ux.onReference(reference, 1);
        Ux.E.fxTerminal(!ref, 10079, ref);
        if (ref) {
            /**
             * 解析Ajax参数信息
             */
            return Ux.parseAjax(ref, config.ajax.magic);
        }
    }
};
export default {
    parseParams
}