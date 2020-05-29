import Ux from "ux";

const yiCommand = (reference, state = {}) => {
    const commandArr = Ux.fromHoc(reference, "commands");
    /* 命令行专用 */
    const commands = [];
    if (Ux.isArray(commandArr)) {
        commandArr.forEach(commandJson => {
            /* 分隔符 */
            if ("divider" === commandJson) {
                commands.push(commandJson);
            } else {
                if ("string" === typeof commandJson) {
                    const commandItem = commandJson.split(',');
                    const [key, text, tooltip, className, confirm] = commandItem;
                    const command = {};
                    command.key = key;
                    command.icon = key;
                    command.text = text;
                    command.tooltip = tooltip;
                    command.confirm = confirm;
                    if (className) command.className = className;
                    commands.push(command);
                } else {
                    commands.push(Ux.clone(commandJson));
                }
            }
        })
    }
    /* svg 图标 */
    commands.filter(command => command.icon && command.icon.startsWith("svg"))
        .forEach(command => command.className = `op-ilink`)
    state.$commands = commands;
    return Ux.promise(state);
}
export default {
    yiCommand,
    yiRowCell: (reference, state) => {
        const {config = {}} = reference.props;
        if (config.grid) {
            const $grid = [];
            const span = 24 / config.grid;
            Ux.itRepeat(config.grid, (idx) => {
                $grid.push({
                    span,                // 默认宽度
                    cellIndex: idx,              // 列索引
                    rowIndex: config.rowIndex,  // 行索引
                })
            })
            state.$cells = $grid;
        }
        return Ux.promise(state);
    }
}