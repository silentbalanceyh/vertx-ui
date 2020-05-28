import dragging from './O.dragging';
import event from './O.event';
import yiPage from './O.yi.page';
import editor from './O.editor';

export default {
    /* yi 系列方法 */
    yiPage,

    ...editor,
    ...dragging,
    ...event,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}