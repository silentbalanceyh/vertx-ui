import Fr from './O.from';
import U from 'underscore';
import Abs from '../../abyss';

/**
 * 从reference的props中读取`key`对应的值，一般用于读取Tabular/Assist
 * @method onDatum
 * @param reference React对应组件引用 React.PureComponent
 * @param {String} key
 * @return {*}
 */
const onDatum = (reference, key) => {
    if (key && "string" === typeof key) {
        const data = Fr.fromDatum(reference, key);
        const dataArray = (data && data.is()) ? data.to() : [];
        return U.isArray(dataArray) ? dataArray : [];
    } else {
        console.warn("[ Ux ] 传入的 `key` 值不对", key);
        return [];
    }
};
const onReference = (reference, current = 0) => {
    let ref = reference;
    let counter = 0;
    while (counter < current) {
        // 读取当前引用的props
        const props = ref.props;
        if (props) {
            ref = props.reference;
        }
        counter++;
    }
    return ref;
};

/**
 * 从React Router中读取路由参数
 * @method onRouting
 * @param reference React对应组件引用 React.PureComponent
 * @param key 需要读取的参数键名
 * @return {*}
 */
const onRouter = (reference, key) => {
    const {$router} = reference.props;
    if ($router) {
        const params = $router.params();
        if (params) {
            return params[key];
        }
    }
};
/*
 * 根据 linker 读取 values
 */
const onLinker = (config = {}, valueSupplier) => {
    const values = {};
    const {linker} = config;
    if (linker && !Abs.isEmpty(linker)
        && U.isFunction(valueSupplier)) {
        const fields = Object.keys(linker)
            .map(field => linker[field])
            .filter(field => !!field);
        const sourceValues = valueSupplier(fields);
        if (sourceValues) {
            Object.keys(sourceValues).forEach(key => {
                /*
                 * linker 中包含了 field 的信息，则直接处理
                 */
                if (linker.hasOwnProperty(key)) {
                    values[key] = sourceValues[key];
                } else {
                    Object.keys(linker)
                        .filter(linkerField => key === linkerField[key])
                        .forEach(linkerField => {
                            values[linkerField] = sourceValues[key];
                        })
                }
            });
        }
    }
    return values;
};
export default {
    onDatum,        // 读取 Tabular 或 Assist
    onReference,    // 读取上层引用
    onRouter,       // 读取路由中的参数
    onLinker,       // 根据 linker 读取数据信息
}