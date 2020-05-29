import Cmd from './I.common';

const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const sourceSpec = {
    /* 返回需要使用的数据结构，item */
    beginDrag: Cmd.itemRow,
    endDrag: (props, monitor) => {
        const dropResult = monitor.getDropResult();
        if (dropResult) {
            console.info("endDrag", props);
        }
    }
};
const targetSpec = {
    drop: (props) => {
    },
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