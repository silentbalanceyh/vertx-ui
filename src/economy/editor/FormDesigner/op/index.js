import yiPage from './O.yi.init';
import dragging from './O.dragging';
import Command from './O.command';

export default {
    yiPage,
    ...dragging,
    Command,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}