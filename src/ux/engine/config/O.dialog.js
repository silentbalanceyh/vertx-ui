import R from '../expression';
import Ut from '../../unity';
import U from 'underscore';
import Abs from '../../abyss';

const configDialog = (reference, config = {}) => {
    const $dialog = R.aiExprWindow(config);
    /*
     * onOk按钮
     */
    if ("string" === typeof $dialog.onOk) {
        const id = $dialog.onOk;
        $dialog.onOk = () => Ut.connectId(id);
    }
    /*
     * onCancel按钮
     */
    $dialog.onCancel = () => reference.setState({$visible: false});
    $dialog.destroyOnClose = true;
    $dialog.maskClosable = false;
    return $dialog;
};
/*
 * Array
 * [
 *    id1, id2
 * ]
 * Object
 * {
 *    key1 = id1,
 *    key2 = id2
 * }
 */

const configAnchor = (reference, op, callback) => {
    const $button = [];
    const rxClick = (key) => (event) => {
        Abs.prevent(event);
        let state = {$visible: true};
        if (U.isFunction(callback[key])) {
            /*
             * 特殊 callback 回调
             */
            const promise = callback[key]();
            promise.then((callbackState = {}) => {
                Object.assign(callbackState, state);
                reference.setState(callbackState);
            });
        } else {
            reference.setState(state);
        }
    };
    if (op) {
        if (U.isArray(op)) {
            /*
             * 数组模式
             */
            op.forEach(key => {
                const button = {};
                button.key = key;
                button.id = key;
                button.className = "ux-hidden";
                button.onClick = rxClick(key);
                $button.push(button);
            })
        } else if (U.isObject(op)) {
            /*
             * 对象格式
             */
            Abs.itObject(op, (key, id) => {
                const button = {};
                button.key = key;
                button.id = id;
                button.className = "ux-hidden";
                button.onClick = rxClick(key);
                $button.push(button);
            })
        }
    }
    return $button;
};
export default {
    configDialog,
    configAnchor
}