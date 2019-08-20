import Yo from './Op.Yo';

const yiDialog = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 当前窗口专用配置
     */
    const state = {};
    state.config = config.dialog;
    state.$ready = true;
    reference.setState(state);
};
export default {
    yiDialog,
    ...Yo,
}