import Ux from 'ux';
import To from './func.to';
import U from 'underscore';

const onApp = ($inited = {}) => {
    const inited = Ux.clone($inited);
    const app = Ux.isInit();
    if (!$inited.appName) {
        inited.appName = app.name;
    }
    if (!$inited.appName) {
        inited.namespace = To.toNamespace(app.name);
    }
    if (undefined === $inited.active) {
        inited.active = true;
    }
    return inited;
};
const onTree = (keys = [], data = [], config = {}) => {
    const source = Ux.toTreeArray(data, config.tree);
    let treeArray = [];
    if (config.mode) {
        const fun = Ux.Tree[config.mode];
        if (U.isFunction(fun)) {
            const result = fun(keys, source);
            const $result = Ux.immutable(result);
            treeArray = data.filter(each => $result.contains(each.key));
        }
    }
    return treeArray;
};
export default {
    onApp,
    onTree,
}