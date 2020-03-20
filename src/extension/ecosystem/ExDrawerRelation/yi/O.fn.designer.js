import Ux from "ux";
import Event from '../event';

export default (reference) => {
    const config = {
        maxHeight: Ux.toHeight(136)
    };
    const designer = Ux.fromHoc(reference, "designer");
    if (designer) {
        Object.assign(config, designer);
    }
    const command = {};
    command.save = Event.onSubmit(reference);
    config.command = command;
    return config;
}