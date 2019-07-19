import Ux from 'ux';
import * as U from 'underscore';

const initCommand = (reference) => {
    const commands = Ux.fromHoc(reference, "native");
    let result = {};
    if (U.isArray(commands)) {
        commands.forEach(item => {
            // 分割线
            const toolbar: any = {};
            const itemArr = item.split(',');
            toolbar.key = itemArr[0];
            toolbar.text = itemArr[1];
            toolbar.command = itemArr[2];
            toolbar.className = itemArr[3];
            result[toolbar.key] = toolbar;
        });
    }
    return result;
};
const initCommands = (commands = {}, keys = []) => {
    const result = [];
    keys.forEach(key => {
        if ("$divider$" === key) {
            result.push(initDivider());
        } else {
            if (commands.hasOwnProperty(key)) {
                result.push(Ux.clone(commands[key]));
            }
        }
    });
    return result;
};
const initDivider = () => {
    const divider: any = {};
    divider.key = Ux.randomString(8);
    divider.divider = true;
    return divider;
};
export default {
    initCommand,
    initCommands,
};