import Ux from "ux";
import U from 'underscore';
import Cmd from './Op.Command';

const initToolbar = (reference) => {
    const toolbar = Ux.fromHoc(reference, "toolbar");
    let $toolbars = [];
    if (U.isArray(toolbar)) {
        const commands = Cmd.initCommand(reference);
        $toolbars = Cmd.initCommands(commands, toolbar);
    }
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
export default {
    initToolbar,
    initEvent
};