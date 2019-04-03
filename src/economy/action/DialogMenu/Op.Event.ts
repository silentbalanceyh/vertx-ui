import * as U from 'underscore';
import {Modal} from 'antd';
import Ux from 'ux';

const rtConfirm = (reference, item) => {
    const {$functions = {}, $inited = {}} = reference.props;
    Modal.confirm({
        ...item.confirm,
        onOk: () => {
            const callback = $functions[item.function];
            if (U.isFunction(callback)) {
                callback($inited, item);
            }
        }
    })
};
const rtDialog = (reference, item) => {
    let {visible = {}} = reference.state;
    visible = Ux.clone(visible);
    visible[item.key] = true;
    reference.setState({visible});
};
const rtDirect = (reference, item) => {

};
const EVENTS = {
    CONFIRM: rtConfirm,
    DIALOG: rtDialog,
    DIRECT: rtDirect
};
const rtClick = (reference) => (event) => {
    const {items = []} = reference.state;
    const item = items.filter(each => each.key === event.key);
    if (1 === item.length) {
        const configuration = item[0];
        const executor = EVENTS[configuration.type];
        if (U.isFunction(executor)) {
            executor(reference, configuration);
        } else {
            console.warn(`[ Zero ] Could not find event of type = ${configuration.type}`)
        }
    } else {
        console.warn(`[ Zero ] Could not find event of key = ${event.key}`)
    }
};
export default {
    rtClick
}