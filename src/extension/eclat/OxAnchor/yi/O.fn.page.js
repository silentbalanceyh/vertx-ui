import Ux from 'ux';

export default (reference) => {
    const config = Ux.sexCab(reference, "config");
    /*
     * dialog 专用
     */
    const dialog = Ux.configDialog(reference, config.window);
    const state = {};
    state.$dialog = dialog;
    state.$visible = false;
    state.$ready = true;
    reference.setState(state);
}