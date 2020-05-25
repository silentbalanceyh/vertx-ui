import Ux from 'ux';

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
                    const [key, text, tooltip, className] = commandItem;
                    const command = {};
                    command.key = key;
                    command.icon = key;
                    command.text = text;
                    command.tooltip = tooltip;
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
const yiPalette = (reference, state) => {

    /* 执行单处理 */
    const fnNorm = (item) => {
        if ("string" === typeof item) {
            const itemArr = item.split(',');
            const [key, text] = itemArr;
            return {key, text};
        } else return Ux.clone(item);
    }
    const paletteJson = Ux.fromHoc(reference, "palette");
    const palette = [];
    /* 基础控件 */
    if (paletteJson.items) {
        const basicTool = {items: []};
        basicTool.title = paletteJson.title;
        basicTool.key = "pageBasic";
        paletteJson.items.map(fnNorm)
            .forEach(item => basicTool.items.push(item));
        palette.push(basicTool);
    }
    state.$palette = palette;
    return Ux.promise(state);
}
export default (reference) => {
    const state = {};
    /* _commands 命令工具栏 */
    yiCommand(reference, state)
        .then(processed => yiPalette(reference, processed))
        .then(Ux.ready).then(Ux.pipe(reference));
}