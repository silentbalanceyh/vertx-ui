import Command from './inst.fn.content';
import CommandStyle from './v.content.style';
import CommandAction from './inst.fn.command';
import CommandDisabled from './inst.fn.command.disabled';
import CommandVisible from './inst.fn.command.visible';
import CommandFooter from './inst.fn.command.';

export default {
    Command,            // 命令内容层
    CommandStyle,       // 命令风格（CSS部分）

    CommandFooter,      // 窗口中的专用 Button
    CommandAction,      // 按钮信息
    CommandDisabled,    // 按钮禁用/启用
    CommandVisible,     // 按钮可见/不可见
}