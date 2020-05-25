import Ux from 'ux';

import dragging from './O.dragging';
import Command from './O.command';
import event from './O.event';

import yiPage from './O.yi.page';
import yiLayout from './O.yi.layout';

export default {
    /* yi 系列方法 */
    yiForm: (reference) => Ux.raftForm(reference)
        .then(Ux.ready).then(Ux.pipe(reference)),
    yiPage,
    yiLayout,

    ...dragging,
    ...event,
    Command,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}