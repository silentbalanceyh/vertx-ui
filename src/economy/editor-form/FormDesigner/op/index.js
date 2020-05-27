import dragging from './O.dragging';
import event from './O.event';
import yiPage from './O.yi.page';

export default {
    /* yi 系列方法 */
    yiPage,

    ...dragging,
    ...event,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}