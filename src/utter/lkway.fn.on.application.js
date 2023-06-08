import Ux from 'ux';
import __To from './pedestal.fn.to.atom';

const onApp = ($inited = {}) => {
    const inited = Ux.clone($inited);
    const app = Ux.isInit();
    if (!$inited.appName) {
        inited.appName = app.name;
    }
    if (!$inited.appName) {
        inited.namespace = __To.toNamespace(app.name);
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
        if (Ux.isFunction(fun)) {
            const result = fun(keys, source);
            treeArray = data.filter(each => result.includes(each.key));
        }
    }
    return treeArray;
};
export default {
    onApp,
    onTree,
}