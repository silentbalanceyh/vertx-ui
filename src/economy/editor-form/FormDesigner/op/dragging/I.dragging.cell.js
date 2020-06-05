import Cmd from "../library";
import Ux from "ux";

const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const sourceSpec = {
    beginDrag: (props, monitor, component) => {
        const item = Cmd.item(props);
        item.source = component;
        return item;
    }
};
const targetSpec = {
    drop: (props, monitor, component) => {
        const sourceItem = monitor.getItem();
        const targetItem = Cmd.item(props);
        if (sourceItem && targetItem) {
            // 关闭覆盖效果
            const {reference} = component.props;
            Cmd.dropColor(reference, false);

            Ux.fn(component).rxCellWrap(sourceItem, targetItem);
        }
    },
    /* 浮游在 Target 之上 */
    hover: (props, monitor, component) => {
        const sourceItem = monitor.getItem();
        const targetItem = Cmd.item(props);
        if (!Cmd.itemCellSame(sourceItem, targetItem)) {
            const {reference} = component.props;
            Cmd.dropColor(reference, monitor.isOver());
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