import Cmd from './I.common';

const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const sourceSpec = {
    /* 返回需要使用的数据结构，item */
    beginDrag: Cmd.itemRow
};
const targetSpec = {
    drop: (props, monitor) => {
        const sourceItem = monitor.getItem();
        const targetItem = Cmd.itemRow(props);
        if (sourceItem && targetItem) {
            const fromIndex = sourceItem.rowIndex;
            const toIndex = targetItem.rowIndex;
            console.info(fromIndex, toIndex);
        }
    },
    /* 浮游在 Target 之上 */
    hover: (props, monitor, component) => {
        const sourceItem = monitor.getItem();
        const targetItem = Cmd.itemRow(props);
        if (!Cmd.itemRowSame(sourceItem, targetItem)) {
            Cmd.dropColor(component, monitor.isOver());
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