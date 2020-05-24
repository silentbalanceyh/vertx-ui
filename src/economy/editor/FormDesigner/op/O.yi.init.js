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
                const commandItem = commandJson.split(',');
                const [key, text, tooltip] = commandItem;
                const command = {};
                command.key = key;
                command.icon = key;
                command.text = text;
                command.tooltip = tooltip;
                commands.push(command);
            }
        })
    }
    state.$commands = commands;
    return Ux.promise(state);
}
export default (reference) => {
    const state = {};
    /* _commands 命令工具栏 */
    yiCommand(reference, state)
        .then(Ux.ready).then(Ux.pipe(reference));
}