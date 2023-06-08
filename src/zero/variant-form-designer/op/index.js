import dragging from './dnd.entry';
import editor from './editor.fn.yi.component';
import yiPage from './event.@fn._.yi.page';
import Cmn from './web.entry';
import event from './event.fn.raft';
import dataIn from './event.e.@fn._.input';
import dataOut from './event.e.@fn._.output';

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
export default exported;