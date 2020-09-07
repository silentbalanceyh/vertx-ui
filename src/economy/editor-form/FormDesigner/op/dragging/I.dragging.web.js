import Ux from 'ux';
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
const dropExecute = (reference, config, render) => {
    const ref = Ux.onReference(reference, 1);
    // 拖拽进来的 cellData 需要重新设置
    const cellData = Ux.clone(config);
    cellData.data = fnRaft(reference, render);
    cellData.render = render;
    Ux.fn(ref).rxCellConfig(cellData);
}
const targetSpec = {
    drop: (props, monitor, component) => {
        // 关闭覆盖效果
        Ux.dndDropColor(component, false);
        // 判断是否可以放入
        const {render} = monitor.getItem();
        fnForbidden(component, render, () => {
            const {config = {}, data = {}} = props;
            /*
             * 特殊的单元格参数信息
             * 1. 使用同结构操作，原生的 config 中追加三个属性
             * - render
             * - data（最终的数据配置）
             * - ready（是否已经拖入了控件）
             *
             * 2. 注意
             * - render 中是新值
             * - data.render 中是旧值
             */
            if (data.render) {
                const ref = Ux.onReference(component, 1);
                Ux.sexDialog(ref, "dropped", () =>
                    // 执行拖拽处理
                    dropExecute(component, config, render))
            } else {
                // 执行拖拽处理
                dropExecute(component, config, render);
            }
        })
    },
    /* 浮游在 Target 之上 */
    hover: (props, monitor, component) => {
        Ux.dndDropColor(component, monitor.isOver());
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