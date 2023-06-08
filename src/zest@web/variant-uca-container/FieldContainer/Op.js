import __Zn from '../zero.uca.dependency';

const yoExtra = ($tabs = {}, reference) => {
    const tabs = __Zn.clone($tabs);
    const {$inited = {}} = reference.props;
    const calculated = __Zn.pluginOp(reference, $inited);
    if (!calculated.edition && !calculated.deletion) {
        delete tabs.tabBarExtraContent;
    } else {
        const {fnExtra} = tabs;
        const {$activeKey} = reference.state;
        if (__Zn.isFunction(fnExtra)) {
            tabs.tabBarExtraContent = fnExtra($activeKey);
            // React does not recognize the `fnExtra` prop on a DOM element.
            delete tabs.fnExtra;
        }
    }
    return tabs;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yoExtra
}