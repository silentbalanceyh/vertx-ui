import Ux from 'ux';

const yiTab = (reference) => {
    const {config = {}} = reference.props;
    const state = {};
    const tabs = Ux.configTab(reference, config);
    const {forceRender = [], ...rest} = tabs;
    if (0 < forceRender.length) {
        const $force = Ux.immutable(forceRender);
        tabs.items.forEach(item => {
            if ($force.contains(item.key)) {
                item.forceRender = true;
            }
        })
    }
    state.$tabs = rest;
    state.$ready = true;
    reference.setState(state);
};
export default {
    yiTab,
}