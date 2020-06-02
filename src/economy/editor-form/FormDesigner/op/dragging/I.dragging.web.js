import Ux from 'ux';
import Cmd from "../library";
import forbidden from './I.drop.forbidden';

const sourceConnect = (connect, monitor) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};
const sourceSpec = {
    beginDrag: (props) => {
        const {item = {}} = props;
        return {type: item.key};
    }
};
const targetSpec = {
    drop: (props, monitor, component) => {
        // 关闭覆盖效果
        Cmd.dropColor(component, false);
        // 判断是否可以放入
        const {type} = monitor.getItem();
        const fnDrop = forbidden[type];
        // 是否可放入
        Ux.dgDebug({type}, "放置组件", "#458B00")
        let okForDrop = true;
        if (Ux.isFunction(fnDrop)) {
            const ref = Ux.onReference(component, 1);
            okForDrop = fnDrop(props, ref);
        }
        // 可以放入时才执行
        if (okForDrop) {

        }
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