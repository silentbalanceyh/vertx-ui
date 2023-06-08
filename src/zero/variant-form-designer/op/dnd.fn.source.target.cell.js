import Cmd from "./web.entry";
import __Zn from '../zero.uca.dependency';

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
            __Zn.dndDropColor(reference, false);
            __Zn.fn(component).rxCellWrap(sourceItem, targetItem);
        }
    },
    /* 浮游在 Target 之上 */
    hover: (props, monitor, component) => {
        const sourceItem = monitor.getItem();
        const targetItem = Cmd.item(props);
        if (!Cmd.itemCellSame(sourceItem, targetItem)) {
            const {reference} = component.props;
            __Zn.dndDropColor(reference, monitor.isOver());
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