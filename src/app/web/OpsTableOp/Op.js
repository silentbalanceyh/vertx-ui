import Ex from 'ex';
import Ux from 'ux';

export default {
    $opSaveSource: (reference) => (event) => {
        Ux.prevent(event);
        Ux.connectId("$opSaveSource");
    },
    $opCancel: (reference) => (event) => {
        Ux.prevent(event);
        Ex.uiDialog(reference, __dialog => __dialog.onClose());
    }
}