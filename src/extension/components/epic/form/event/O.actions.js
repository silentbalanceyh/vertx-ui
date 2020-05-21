import Ux from 'ux';
import Ex from 'ex';

const onAdd = (reference) => (event) => {
    Ux.prevent(event);
    Ex.uiDialog(reference,
        __dialog => __dialog.onOpen()
    );
};
const onEdit = (reference, $inited) => (event) => {
    Ux.prevent(event);
    Ex.uiDialog(reference,
        __dialog => __dialog.onOpen($inited)
    );
};
const onDelete = (reference) => (event) => {
    console.info("Delete");
};
const onDesign = (reference, $inited) => (event) => {
    Ux.prevent(event);
    /* 上册引用 */
    Ex.uiTab(reference,
        __tabs => __tabs.onOpen('tabDesign', $inited)
    );
};
export default {
    onAdd,
    onEdit,
    onDelete,
    onDesign
}