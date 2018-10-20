import E from '../Ux.Error';
import {DataLabor} from 'entity';
import U from 'underscore';
import Value from '../Ux.Value';

/**
 * 直接从Hoc资源路径读取数据信息
 * @method fromPath
 * @param reference
 * @param keys
 */
const fromPath = (reference = {}, ...keys) => {
    E.fxTerminal(1 > keys.length, 10070, keys, 1);
    let data = fromHoc(reference, keys[0]);
    if (1 < keys.length && data) {
        const path = [];
        keys.forEach((item, index) => {
            if (0 < index) {
                path.push(item);
            }
        });
        const $data = Value.immutable(data);
        data = $data.getIn(path);
        if (data && data.toJS) {
            data = data.toJS();
        }
    }
    return data;
};
/**
 * 资源文件数据读取方法
 * @method fromHoc
 * @param {React.PureComponent} reference React对应组件引用
 * @param {String} key 读取对应属性名
 * @return {null}
 */
const fromHoc = (reference = {}, key = "") => {
    E.fxTerminal("string" !== typeof key, 10000, "string", typeof key);
    const {$hoc} = reference.state;
    return ($hoc) ? $hoc._(key) : null;
};
/**
 * 从路由参数中读取数据专用
 * @method fromRouter
 * @param {React.PureComponent} reference React对应组件引用
 * @param {String} key 读取对应属性名
 * @return {null}
 */
const fromRouter = (reference = {}, key = "") => {
    E.fxTerminal(!key, 10066, "fromRouter", key);
    const {$router} = reference.props;
    return $router ? $router._(key) : null;
};

const fromDatum = (reference, key) => {
    key = key.replace(/\./g, "_");
    if (reference.props) {
        const targetKey =
            reference.props[`$t_${key}`] || reference.props[`$a_${key}`];
        if (targetKey) {
            if (targetKey.is()) {
                return targetKey;
            } else {
                return targetKey;
            }
        }
    }
    return DataLabor.getArray(undefined);
};
/**
 * 从reference的props中读取`key`对应的值，一般用于读取Tabular/Assist
 * @method onDatum
 * @param {React.PureComponent} reference React对应组件引用
 * @param {String} key
 * @return {*}
 */
const onDatum = (reference, key) => {
    const data = fromDatum(reference, key);
    const dataArray = (data && data.is()) ? data.to() : [];
    return U.isArray(dataArray) ? dataArray : [];
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
const onArray = (...args) => {
    let ref = null;
    if (1 === args.length && U.isArray(args[0])) {
        ref = args[0];
    } else {
        ref = args;
    }
    return ref;
};
/**
 * 从React Router中读取路由参数
 * @method onRouting
 * @param {React.PureComponent} reference React对应组件引用
 * @param key 需要读取的参数键名
 * @return {*}
 */
const onRouting = (reference, key) => {
    const {$router} = reference.props;
    if ($router) {
        const params = $router.params();
        if (params) {
            return params[key];
        }
    }
};
/**
 * @class Prop
 * @description 属性专用处理器
 */
export default {
    // 从reference中抽取数据
    onRouting,
    onDatum,
    onReference,
    onArray,
    // 从Hoc, Router中提取数据
    fromHoc,
    fromRouter,
    fromPath,
    fromDatum
};
