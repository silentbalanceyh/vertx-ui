import {Modal} from 'antd';
import Ux from 'ux';

const onConfirm = (reference, item) => {
    const {$functions = {}, $inited = {}} = reference.props;
    Modal.confirm({
        ...item.confirm,
        onOk: () => {
            const callback = $functions[item.function];
            if (Ux.isFunction(callback)) {
                callback($inited, item);
            }
        }
    })
};
const onDialog = (reference, item) => {
    let {visible = {}} = reference.state;
    visible = Ux.clone(visible);
    visible[item.key] = true;
    reference.setState({visible});
};
const onDirect = (reference, item) => {

};
const EVENTS = {
    CONFIRM: onConfirm,
    DIALOG: onDialog,
    DIRECT: onDirect
};
const onClick = (reference) => (event) => {
    const {items = []} = reference.state;
    const item = items.filter(each => each.key === event.key);
    if (1 === item.length) {
        const configuration = item[0];
        const executor = EVENTS[configuration.type];
        if (Ux.isFunction(executor)) {
            executor(reference, configuration);
        } else {
            console.warn(`[ Zero ] Could not find event of type = ${configuration.type}`)
        }
    } else {
        console.warn(`[ Zero ] Could not find event of key = ${event.key}`)
    }
};
export default {
    onClick
}