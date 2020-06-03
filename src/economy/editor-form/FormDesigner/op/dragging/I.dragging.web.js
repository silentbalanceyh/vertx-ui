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
        return {
            render: item.key,   // 渲染类型，和菜单中的类型匹配
        };
    }
};
const targetSpec = {
    drop: (props, monitor, component) => {
        // 关闭覆盖效果
        Cmd.dropColor(component, false);
        // 判断是否可以放入
        const {render} = monitor.getItem();
        fnForbidden(component, render, () => {
            const ref = Ux.onReference(component, 1);
            const {config = {}} = props;
            /*
             * 特殊的单元格参数信息
             * 1. 使用同结构操作，原生的 config 中追加三个属性
             * - render
             * - data（最终的数据配置）
             * - ready（是否已经拖入了控件）
             */
            const cellData = Ux.clone(config);
            cellData.data = fnRaft(component, render);
            cellData.render = render;
            Ux.fn(ref).rxCellConfig(cellData);
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