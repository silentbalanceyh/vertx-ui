import yiInit from './I.fn.init';
import Ux from 'ux';

export default (reference, prevProps) => {
    if (reference.props.value !== prevProps.value) {
        if (reference.props.value) {
            // 1. 检查 是否发生了改变
            const meta = reference.props['data-__meta'];
            if (meta) {
                const initValue = meta['initialValue'];
                // 直接更新
                if (initValue === reference.props.value) {
                    yiInit(reference);
                }
            }
        } else {
            /*
             * 无值的时候执行清空
             */
            const {config = {}} = reference.props;
            const {linker = {}} = config;
            if (!Ux.isEmpty(linker)) {
                const normalized = {};
                Object.keys(linker)
                    .map(field => linker[field])
                    .forEach(field => normalized[field] = undefined);
                const ref = Ux.onReference(reference, 1);
                Ux.formHits(ref, normalized);
            }
        }
    }
};