import showDialog from './callback.dialog';
import Message from './callback.message';
import Fn from '../func';

export default {
    showDialog,
    ...Message,
    /*
     * Callback 专用方法
     */
    cbDialog: (reference, key) => (data) =>
        showDialog(reference, {key, data}),
    cbTrue: (consumer, message) => (result) => {
        if (result) {
            consumer();
            const wrapperMsg = Fn.toMessage(message);
            if (wrapperMsg) {
                Message.showSuccess(wrapperMsg);
            }
        } else {
            console.error("[ Ex ] 远程访问出现了 false 的结果！", result)
        }
    }
}