const init = (reference) => {
    const {$config = {}} = reference.props;
    // notice处理
    const {notice = {}, upload = ""} = $config;
    // 状态设置
    const state = {};
    state.$notice = notice;
    // 按钮ID
    state.$upload = upload;
    reference.setState(state);
};

export default {
    init,
}