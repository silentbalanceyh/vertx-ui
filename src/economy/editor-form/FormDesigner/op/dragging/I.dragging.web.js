import Cmd from "../library";

const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const sourceSpec = {
    beginDrag: (props) => {
        return {};
    }
};
const targetSpec = {
    drop: (props, monitor, component) => {
        // 关闭覆盖效果
        Cmd.dropColor(component, false);
    },
    /* 浮游在 Target 之上 */
    hover: (props, monitor, component) => {
        Cmd.dropColor(component, monitor.isOver());
    }
};
const targetConnect = (connect, monitor) => {
    return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        dropResult: monitor.getDropResult(),
        connectDropTarget: connect.dropTarget()
    };
};
export default {
    sourceConnect,
    sourceSpec,
    targetConnect,
    targetSpec
};