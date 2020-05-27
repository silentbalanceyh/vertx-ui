const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const _updateState = (pointer = {}) => {
    if (pointer.state) {
        const {targetType, targetKey} = pointer.state;
        if (targetType && targetKey) {
        }
    }
};
const sourceSpec = {
    beginDrag: (props) => {
        return {};
    },
    endDrag: (props, monitor) => {
        const dropResult = monitor.getDropResult();
        if (dropResult) {
        }
    }
};
const targetSpec = {
    drop: (props) => {
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
    /* 这两个事件会在拖拽过程中报错 */
    sourceFix: {
        onItemHover: (event) => {

        },
        onClick: (event) => {

        }
    },
    targetConnect,
    targetSpec
};