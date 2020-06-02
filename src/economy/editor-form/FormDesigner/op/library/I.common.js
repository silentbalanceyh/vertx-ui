import Ux from "ux";

const yiCommand = (reference, state = {}, key = "commands") => {
    const commandArr = Ux.fromHoc(reference, key);
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
const cellNew = (reference) => {
    const {config = {}} = reference.props;
    if (config.grid) {
        const span = 24 / config.grid;
        return {
            key: `cell-${Ux.randomString(8)}`,  // 默认的 key
            span,                               // 默认宽度
            cellIndex: 0,                       // 列索引
            rowIndex: config.rowIndex,          // 行索引
        }
    } else {
        console.error("丢失了重要参数 config.grid", config);
        throw new Error("丢失了重要参数！");
    }
}

export default {
    cellSpans: ($cells = []) => $cells.map(cell => cell.span)
        .reduce((left, right) => left + right, 0),
    cellNew,
    yiCommand,
    yiRowCell: (reference, state) => {
        const $cells = [];
        $cells.push(cellNew(reference));
        state.$cells = $cells;
        return Ux.promise(state);
    }
}