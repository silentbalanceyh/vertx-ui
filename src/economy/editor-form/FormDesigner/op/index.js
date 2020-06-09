import dragging from './dragging/O.dragging';
import editor from './editor/O.editor';
import yiPage from './O.yi.page';
import Cmn from './library';
import event from './O.event';
import dataIn from './O.data.input';

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
    },
    /* 开放的函数区域 */
    ...Cmn,
    /* 特殊方法 */
    dataIn,
}
console.info(exported);
export default exported;