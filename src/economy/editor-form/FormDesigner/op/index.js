import dragging from './dragging/O.dragging';
import event from './O.event';
import yiPage from './O.yi.page';
import editor from './editor/O.editor';

const exported = {
    /* yi 系列方法 */
    yiPage,

    ...editor,
    ...dragging,
    ...event,
    DragTypes: {
        FormDesigner: "FormDesigner",
        RowDesigner: "RowDesigner",
        CellDesigner: "CellDesigner"
    }
}
console.info(exported);
export default exported;