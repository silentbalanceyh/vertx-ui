import yiPage from './O.yi.init';

import dragging from './O.dragging';
import Command from './O.command';
import event from './O.event';

export default {
    yiPage,
    ...dragging,
    ...event,
    Command,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}