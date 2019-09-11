import Ux from 'ux';
/*
 * 统一表单
 * ExForm
 * ExLogin
 * ExEntry
 */
export default (reference) => {
    const state = {};
    let {
        config = {},
        $op = {},
    } = reference.props;
    // 内置拷贝相关信息保证不冲突
    config = Ux.clone(config);
    Ux.capForm(reference, config,).then(response => {
        const {form, addOn = {}} = response;
        state.raft = Ux.configForm(form, addOn);
        state.$ready = true;
        /*
         * 直接做权限过滤
         */
        state.$op = $op;    // 绑定的Op
        reference.setState(state);
    }).catch(error => {
        console.error(error);
    });
}