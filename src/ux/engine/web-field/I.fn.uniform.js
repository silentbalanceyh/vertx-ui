import Abs from "../../abyss";
import R from '../expression';

export default (reference, jsx, onChange) => {
    /*
     * 修复 jsx 构造最新的 rest
     */
    const exclude = Abs.immutable([
        "config",   // optionJsx.config
        "depend",  // optionJsx.depend
        "filter",    // optionJsx.filter
        // 下边是注入类配置
        "eventPrevent",
        "eventDisabled",
        "options",   // 后入参数
    ]);
    // 解决 rest 为 {} 时引起的 Bug
    const rest = {};
    Object.keys(jsx).filter(key => !exclude.contains(key))
        .forEach(key => rest[key] = jsx[key]);
    /*
     * 1）onChange 事件的处理（先构造配置项）
     */
    const {
        config,                  // 基本项配置：optionJsx.config
        depend,                 // 触发项配置：optionJsx.depend
        eventPrevent = true,     // 行为项配置：（编程传入）
        eventDisabled = false,   // ReadOnly的时候是否禁用（用于特殊配置）
        options = [],            // options，用于后期处理
    } = jsx;
    const $config = {
        reference,                      // 组件引用
        prevent: eventPrevent,          // 特殊配置
        options,                        // 处理 options 专用
    };
    if (config) {
        $config.config = Abs.clone(config);      // 当前 Jsx 核心配置
    }
    if (depend) {
        $config.depend = Abs.clone(depend);    // 当前 depend 配置
    }
    /*
     * 往 rest 中注入特殊的 onChange
     */
    R.Ant.onChange(rest, onChange, $config);

    /*
     * 2）ReadOnly处理
     * 注意第二参数，该参数用于让组件在 readOnly 的时候同步 disabled 禁用组件
     * 如果组件不是 Input 的时候必须
     */
    R.Ant.onReadOnly(rest, eventDisabled, reference);
    return rest;    // 返回构造好的 rest
}