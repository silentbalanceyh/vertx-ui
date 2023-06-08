import Cmd from "./web.entry";
import __Zn from '../zero.uca.dependency';

const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const sourceSpec = {
    /* 返回需要使用的数据结构，item */
    beginDrag: Cmd.item
};
const targetSpec = {
    drop: (props, monitor, component) => {
        const sourceItem = monitor.getItem();
        const targetItem = Cmd.item(props);
        if (sourceItem && targetItem) {
            const fromIndex = sourceItem.rowIndex;
            const toIndex = targetItem.rowIndex;
            __Zn.fn(component).rxRowWrap(fromIndex, toIndex);
            // 关闭覆盖效果
            __Zn.dndDropColor(component, false);
        }
    },
    /* 浮游在 Target 之上 */
    hover: (props, monitor, component) => {
        const sourceItem = monitor.getItem();
        const targetItem = Cmd.item(props);
        if (!Cmd.itemRowSame(sourceItem, targetItem)) {
            __Zn.dndDropColor(component, monitor.isOver());
        }
    }
};
const targetConnect = (connect, monitor) => {
    return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        dropResult: monitor.getDropResult(),
        connectDropTarget: connect.dropTarget(),
        dragItem: monitor.getItem(),
    };
};
export default {
    sourceConnect,
    sourceSpec,
    targetConnect,
    targetSpec
};