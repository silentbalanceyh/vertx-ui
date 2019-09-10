import Fr from './O.from';
import U from 'underscore';

/**
 * 从reference的props中读取`key`对应的值，一般用于读取Tabular/Assist
 * @method onDatum
 * @param reference React对应组件引用 React.PureComponent
 * @param {String} key
 * @return {*}
 */
const onDatum = (reference, key) => {
    const data = Fr.fromDatum(reference, key);
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
export default {
    onDatum,        // 读取 Tabular 或 Assist
    onReference,    // 读取上层引用
    onRouter,       // 读取路由中的参数
}