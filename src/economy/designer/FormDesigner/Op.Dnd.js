const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    }
};
const _updateState = (pointer = {}) => {
    if (pointer.state) {
        const {targetType, targetKey} = pointer.state;
        if (targetType && targetKey) {
            const {mounted = {}} = pointer.state;
            mounted[targetKey] = targetType;
            const state = {};
            state.mounted = mounted;
            state.targetType = undefined;
            state.targetKey = undefined;
            pointer.setState(state);
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
            const {pointer} = props;
            pointer.setState({targetType: props.type});
            _updateState(pointer);
        }
    }
};
const targetSpec = {
    drop: (props) => {
        const {pointer} = props;
        pointer.setState({targetKey: props.item.key});
        _updateState(pointer);
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
}