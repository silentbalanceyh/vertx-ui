import Ux from 'ux';
import {QQuery} from 'entity';

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
            const params = Ux.parseAjax(ref, config.ajax.params);
            const {$filters = {}} = reference.state;
            let request = {};
            if (Ux.isEmpty($filters)) {
                request = Ux.clone(params);
            } else {
                /*
                 * 构造新的查询条件
                 */
                const queryRef = new QQuery(params, reference);
                queryRef.and($filters);
                request = queryRef.to();
            }
            Ux.dgDebug(request, "[ Xt ] 自定义组件参数解析");
            return request;
        }
    }
};
export default {
    parseParams
}