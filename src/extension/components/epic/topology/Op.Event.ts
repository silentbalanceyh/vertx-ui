import Ux from "ux";
import * as U from 'underscore';
import Cmd from './Op.Command';

const initToolbar = (reference) => {
    const toolbar = Ux.fromHoc(reference, "toolbar");
    let toolbarArray = [];
    if (U.isArray(toolbar)) {
        const commands = Cmd.initCommand(reference);
        toolbarArray = Cmd.initCommands(commands, toolbar);
    }
    /** 分组，按command **/
    const $toolbars = {};
    toolbarArray.forEach(item => $toolbars[item.command] = item.text);
    return $toolbars;
};
const initEvent = (reference, key) => {
    let $command = [];
    if (key) {
        const event = Ux.fromHoc(reference, "event");
        const commands = Cmd.initCommand(reference);
        if (event.hasOwnProperty(key)) {
            const keys = event[key];
            $command = Cmd.initCommands(commands, keys);
        }
    }
    return $command;
};
const initDetail = (reference) => {
    return Ux.fromHoc(reference, "detail");
};
export default {
    initToolbar,
    initEvent,
    initDetail
};