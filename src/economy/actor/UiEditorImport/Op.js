const init = (reference) => {
    const {$config = {}} = reference.props;
    // notice处理
    const {notice = {}, upload = "", button = ""} = $config;
    // 状态设置
    const state = {};
    state.$notice = notice;
    // 按钮ID
    state.$upload = upload;
    // 按钮ID
    state.$button = button;
    reference.setState(state);
};

export default {
    init,
};