import Command from './O.content';
import CommandStyle from './O.content.style';
import CommandAction from './O.command';
import CommandDisabled from './O.command.disabled';
import CommandVisible from './O.command.visible';
import CommandFooter from './O.command.footer';

export default {
    Command,            // 命令内容层
    CommandStyle,       // 命令风格（CSS部分）

    CommandFooter,      // 窗口中的专用 Button
    CommandAction,      // 按钮信息
    CommandDisabled,    // 按钮禁用/启用
    CommandVisible,     // 按钮可见/不可见
}