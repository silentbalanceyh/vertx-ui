import dragging from './O.dragging';
import Command from './O.command';
import event from './O.event';
import yiPage from './O.yi.page';

export default {
    /* yi 系列方法 */
    yiPage,

    ...dragging,
    ...event,
    Command,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}