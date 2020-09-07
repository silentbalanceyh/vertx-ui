import Cmd from "../library";
import Ux from 'ux';

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
            Ux.fn(component).rxRowWrap(fromIndex, toIndex);
            // 关闭覆盖效果
            Ux.dndDropColor(component, false);
        }
    },
    /* 浮游在 Target 之上 */
    hover: (props, monitor, component) => {
        const sourceItem = monitor.getItem();
        const targetItem = Cmd.item(props);
        if (!Cmd.itemRowSame(sourceItem, targetItem)) {
            Ux.dndDropColor(component, monitor.isOver());
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