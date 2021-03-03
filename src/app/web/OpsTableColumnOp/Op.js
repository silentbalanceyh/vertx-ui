import Ex from 'ex';
import Ux from 'ux';

export default {
    $opSaveTaleColumn: (reference) => (event) => {
        Ux.prevent(event);
        Ux.connectId("$opSaveTaleColumn");
    },
    $opCancel: (reference) => (event) => {
        Ux.prevent(event);
        Ex.uiDialog(reference, __dialog => __dialog.onClose());
    }
}