import Eng from '../engine';
import T from '../unity';
import Abs from '../abyss';
import Ajx from '../ajax';
import Ele from '../element';
import Dev from '../develop';

import xtLazyAjax from './I.fn.lazy.ajax';

const xtValues = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 提取 Form 中需要提取的字段
     */
    const ref = Eng.onReference(reference, 1);
    if (ref) {
        return Eng.onLinker(config, (fields) => T.formGet(ref, fields));
    } else {
        return {};
    }
};

const xtLazyInit = (reference) => {
    const {value, config = {}, id} = reference.props;
    if (undefined === value) {
        const values = xtValues(reference);
        if (!Abs.isEmpty(values)) {
            Dev.dgDebug(values, "[ Xt ] 初始化时的 linker 值", "#8B3A62");
            const ref = Eng.onReference(reference, 1);
            /*
             * 有值，执行 loading 操作
             */
            const params = xtLazyAjax(reference, config);
            /*
             * 回调处理
             */
            const fnCallback = (unique = {}) => {
                const formValues = {};
                T.writeLinker(formValues, config, () => unique);
                if (formValues.hasOwnProperty(id)) {
                    reference.setState({initialValue: formValues});
                    T.formHits(ref, formValues);
                } else {
                    console.warn(`${id} 字段并没配置在 linker 中，请检查：`, unique);
                }
            };
            /*
             * engine模式和非engine模式的自动判断
             */
            const isQr = Abs.isQr(config);
            if (isQr) {
                /*
                 * 查询引擎接口
                 */
                const inputCond = Abs.clone(values);
                inputCond[""] = true;
                const request = Eng.qrCombine(params, ref, inputCond);
                Dev.dgDebug(request, "[ Xt ] engine = true 的最终查询条件", "#8B3A62");
                Ajx.asyncData(config.ajax, request, (data) => {
                    const unique = Abs.isArray(data.list) ? data.list : [];
                    if (1 === unique.length) {
                        fnCallback(unique[0]);
                    }
                });
            } else {
                /*
                 * 非查询引擎接口
                 */
                Dev.dgDebug(params, "[ Xt ] engine = false 的最终查询条件", "#8B3A62");
                Ajx.asyncData(config.ajax, params, (sourceArray) => {
                    const unique = Ele.elementFind(sourceArray, values);
                    if (1 === unique.length) {
                        fnCallback(unique[0]);
                    }
                });
            }
        }
    }
};

const xtLazyUp = (reference, virtualRef) => {
    const prevValue = virtualRef.props.value;
    const curValue = reference.props.value;
    /*
     * 发生改变的时候操作
     */
    if (prevValue !== curValue) {
        /*
         * 表单专用判断
         */
        const ref = Eng.onReference(reference, 1);
        const {form} = ref.props;
        const {value, config = {}} = reference.props;
        /*
         * 是否操作过（未操作就是重置状态）
         */
        const isTouched = form.isFieldsTouched();
        if (isTouched) {
            /*
             * 非重置
             */
            if (!value) {
                /*
                 * 添加：重置
                 */
                const formValues = {};
                T.writeLinker(formValues, config, () => ({}));
                if (!Abs.isEmpty(formValues)) {
                    T.formHits(ref, formValues);
                }
            }
        } else {
            /*
             * 重置表单
             */
            const {initialValue = {}} = reference.state;
            if (Abs.isEmpty(initialValue)) {
                /*
                 * 添加：重置
                 */
                const formValues = {};
                T.writeLinker(formValues, config, () => ({}));
                if (!Abs.isEmpty(formValues)) {
                    T.formHits(ref, formValues);
                }
            } else {
                /*
                 * 编辑：重置
                 */
                const fields = Object.keys(initialValue);
                const current = T.formGet(ref, fields);
                if (Abs.isDiff(current, initialValue)) {
                    T.formHits(ref, initialValue);
                }
            }
        }
    }
};
export default {
    xtLazyInit,
    xtLazyUp,
    xtLazyAjax,
}