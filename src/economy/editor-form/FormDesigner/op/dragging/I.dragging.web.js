import Ux from 'ux';
import Cmd from "../library";
import fnForbidden from './I.drop.forbidden';
import fnRaft from './I.drop.raft'

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
        fnForbidden(component, type, () => {
            const ref = Ux.onReference(component, 1);
            const {config = {}} = props;
            // 特殊的单元格参数信息
            const rowData = {};
            rowData.type = type;
            rowData.config = Ux.clone(config);
            rowData.raft = fnRaft(component, type);
            Ux.fn(ref).rxCellConfig(rowData);
        })
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