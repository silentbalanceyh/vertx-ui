import Eng from '../engine';
import T from '../unity';
import Abs from '../abyss';
import Ajx from '../ajax';
import Ele from '../element';
import U from "underscore";
import E from '../error';

/*
 * 根据 linker 读取 values
 */
const xtLinker = (config = {}, valueSupplier) => {
    const values = {};
    const {linker} = config;
    if (linker && !Abs.isEmpty(linker)
        && U.isFunction(valueSupplier)) {
        const fields = Object.keys(linker)
            .map(field => linker[field])
            .filter(field => !!field);
        const sourceValues = valueSupplier(fields);
        if (!Abs.isEmpty(sourceValues)) {
            Object.keys(sourceValues).forEach(formField => Object.keys(linker)
                .filter(linkerField => formField === linker[linkerField])
                .forEach(linkerField => {
                    values[linkerField] = sourceValues[formField];
                }));
        }
    }
    return values;
};

const xtValues = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 提取 Form 中需要提取的字段
     */
    const ref = Eng.onReference(reference, 1);
    if (ref) {
        return xtLinker(config, (fields) => T.formGet(ref, fields));
    } else {
        return {};
    }
};

const xtLazyInit = (reference) => {
    const {value, config = {}, id} = reference.props;
    if (undefined === value) {
        const values = xtValues(reference);
        if (!Abs.isEmpty(values)) {
            const ref = Eng.onReference(reference, 1);
            /*
             * 有值，执行 loading 操作
             */
            const params = Eng.parseAjax(ref, config.ajax.magic);
            const {engine = true} = config.ajax;
            if (engine) {
                /*
                 * 查询引擎接口（默认）
                 */
            } else {
                /*
                 * 非查询引擎接口
                 */
                Ajx.asyncData(config.ajax, params, ($data = {}) => {
                    /*
                     * 执行过滤
                     */
                    const unique = Ele.elementFind($data, values);
                    if (1 === unique.length) {
                        const formValues = {};
                        T.writeLinker(formValues, config, () => unique[0]);
                        if (formValues.hasOwnProperty(id)) {
                            reference.setState({initialValue: formValues});
                            T.formHits(ref, formValues);
                        } else {
                            console.warn(`${id} 字段并没配置在 linker 中，请检查：`, unique[0]);
                        }
                    }
                });
            }
        }
    }
};

const xtLazyAjax = (reference, config = {}) => {
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
            /**
             * 解析Ajax参数信息
             */
            return Eng.parseAjax(ref, config.ajax.magic);
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