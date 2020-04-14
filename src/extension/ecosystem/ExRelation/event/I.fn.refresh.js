import Ux from "ux";

export default (reference) => (new Promise(resolve => {
    const {current = {}} = reference.props;
    const {rxRefresh} = reference.props;
    if (Ux.isFunction(rxRefresh) && current.key) {
        Ux.dgDebug({current}, "触发界面刷新！");
        rxRefresh(current.key).then(data => resolve(data));
    } else {
        resolve(current);
    }
}))