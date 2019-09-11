import Ux from 'ux';

const yiTab = (reference) => {
    const {config = {}} = reference.props;
    const state = {};
    state.$tabs = Ux.configTab(reference, config);
    state.$ready = true;
    reference.setState(state);
};
export default {
    yiTab
}