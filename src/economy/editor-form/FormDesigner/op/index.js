import dragging from './dragging/O.dragging';
import editor from './editor/O.editor';
import yiPage from './O.yi.page';
import Cmn from './library';
import event from './O.raft.event';
import dataIn from './O.fn.data.input';
import dataOut from './O.fn.data.output';

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
    dataOut,
}
console.info(exported);
export default exported;