import Ex from 'ex';

const yoButton = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 拆开
     */
    const {
        text = "",          // 文字
        id, key,            // 主键
        icon,               // 图标
        type = "default",   // 按钮类型
        plugin = {},        // 插件
        disabled = false,   // 被默认值
    } = config;
    /*
     * 这里的目的是做一件事，主要
     */
    const onClick = Ex.configClick(config, reference);
    return {
        text, icon,
        id, key,
        type,
        onClick,                    // 最终按钮点击事件
        plugin,                     // 插件直接放置到配置中，不转换
        disabled
    };
};
export default {
    yoButton
}