const item = (props) => {
    const item = {};
    const {config = {}} = props;
    item.rowIndex = config.rowIndex;
    item.key = config.key;
    return item;
}
const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const sourceSpec = {
    /* 返回需要使用的数据结构，item */
    beginDrag: item,
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
    item,
    sourceConnect,
    sourceSpec,
    targetConnect,
    targetSpec
};