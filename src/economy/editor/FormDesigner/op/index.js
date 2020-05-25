import Ux from 'ux';
import yiPage from './O.yi.init';

import dragging from './O.dragging';
import Command from './O.command';
import event from './O.event';

export default {
    yiForm: (reference) => Ux.raftForm(reference)
        .then(Ux.ready).then(Ux.pipe(reference)),
    yiPage,
    ...dragging,
    ...event,
    Command,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}