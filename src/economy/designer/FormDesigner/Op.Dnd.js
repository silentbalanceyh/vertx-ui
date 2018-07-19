const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource()
    }
};
const sourceSpec = {
    beginDrag: () => {
        console.info("Drag");
        return {};
    }
};
const targetSpec = {};
const targetConnect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget()
    };
};
export default {
    sourceConnect,
    sourceSpec,
    targetConnect,
    targetSpec
}