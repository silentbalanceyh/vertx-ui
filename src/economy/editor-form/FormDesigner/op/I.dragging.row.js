const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const sourceSpec = {
    beginDrag: (props) => {
        return {};
    },
    endDrag: (props, monitor) => {
        const dropResult = monitor.getDropResult();
        if (dropResult) {
            console.info(dropResult);
        }
    }
};
const targetSpec = {
    drop: (props) => {
    },
    hover: (props, monitor, component) => {
        hoverSwitch(component, () => monitor.isOver());
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
const hoverSwitch = (reference, predicate) => {
    const {$hover} = reference.state;
    if (predicate()) {
        if (!$hover) {
            reference.setState({$hover: true});
        }
    } else {
        if ($hover) {
            reference.setState({$hover: false});
        }
    }
}
export default {
    hoverSwitch,
    sourceConnect,
    sourceSpec,
    targetConnect,
    targetSpec
};