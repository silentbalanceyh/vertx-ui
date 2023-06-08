import CmnCell from './web.fn.cell.element';
import CmnRow from './web.fn.row.operation';
import {Dsl} from 'entity';
import __Zn from '../zero.uca.dependency';

const yiCommand = (reference, state = {}, key = "commands") => {
    const commandArr = __Zn.fromHoc(reference, key);
    /* 命令行专用 */
    const commands = [];
    if (__Zn.isArray(commandArr)) {
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
                    commands.push(__Zn.clone(commandJson));
                }
            }
        })
    }
    /* svg 图标 */
    commands.filter(command => command.icon && command.icon.startsWith("svg"))
        .forEach(command => command.className = `op-ilink`)
    state.$commands = commands;
    return __Zn.promise(state);
}

const yiModel = (state = {}, $models = {}) => {
    state.$models = $models;
    state.$modelsAttrs = {};
    {
        const fields = [];
        const {attributes = []} = $models;
        attributes.forEach(attribute => {
            const item = {};
            item.key = attribute.name;
            item.display = attribute.alias;
            item.data = __Zn.clone(attribute);
            fields.push(item);
        });
        // ASSIST: 字段列表
        state.$a_model_fields = Dsl.getArray(fields);
    }
    return __Zn.promise(state);
}

export default {
    ...CmnCell,
    ...CmnRow,
    yiCommand,
    yiModel,
}