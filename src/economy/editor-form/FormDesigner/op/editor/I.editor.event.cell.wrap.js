import Ux from 'ux';
import Cmn from '../library';

const toRow = (cells = []) => {
    const rowData = {};
    const keys = new Set();
    cells.filter(cell => !!cell.rowKey).forEach(cell => keys.add(cell.rowKey));
    const $rowKeys = Array.from(keys);
    if (1 === $rowKeys.length) {
        rowData.key = $rowKeys[0];
        rowData.data = cells;
        return rowData;
    } else {
        throw new Error("列索引出错，请检查！")
    }
}

const toRaft = (item = {}, columns) => {
    const {raft, ...rest} = item;
    if (raft.span !== item.span) {
        raft.span = item.span;
    }
    Cmn.cellGrid(raft, {
        ...rest,
        columns, // : targetCells.length,
    });
    item.raft = raft;
    // 处理数据基础信息
    item.length = columns;
}

export default (targetRef) => (fromItem, toItem) => {
    const {source, ...fromData} = fromItem;
    const sourceRef = Ux.onReference(source, 1);
    /*
    * 1. 读取源 $rows
    * 2. 读取目标 $rows
    * */
    if (sourceRef && targetRef) {
        let sourceCells = sourceRef.props.data;
        sourceCells = Ux.clone(sourceCells);
        let targetCells = targetRef.props.data;
        targetCells = Ux.clone(targetCells);
        /*
         * fromItem 拖拽到 toItem
         */
        if (fromData.rowIndex === toItem.rowIndex) {
            /*
             * 同行交换
             * 1）交换坐标
             * 2）交换 span
             */
            const sourceItem = Ux.clone(fromData);
            sourceItem.cellIndex = toItem.cellIndex;
            sourceItem.span = toItem.span;

            const targetItem = Ux.clone(toItem);
            targetItem.cellIndex = fromData.cellIndex;
            targetItem.span = fromData.span;

            /*
             * 更新对应的列坐标
             */
            sourceCells[sourceItem.cellIndex] = sourceItem;
            sourceCells[targetItem.cellIndex] = targetItem;
            Cmn.rowRefresh(sourceRef, sourceCells);
        } else {
            /*
             * 不同行交换
             * 1）交换坐标
             * 2）交换 span
             */
            const sourceItem = Ux.clone(fromData);
            sourceItem.cellIndex = toItem.cellIndex;
            sourceItem.rowIndex = toItem.rowIndex;
            sourceItem.rowKey = toItem.rowKey;
            sourceItem.span = toItem.span;

            const targetItem = Ux.clone(toItem);
            targetItem.cellIndex = fromData.cellIndex;
            targetItem.rowIndex = fromData.rowIndex;
            targetItem.rowKey = fromData.rowKey;
            targetItem.span = fromData.span;

            /*
             * 修改 sourceCells / targetCells
             */
            toRaft(targetItem, sourceCells.length);
            toRaft(sourceItem, targetCells.length);
            sourceCells[fromData.cellIndex] = targetItem;
            targetCells[toItem.cellIndex] = sourceItem;

            const results = [];
            results.push(toRow(sourceCells));
            results.push(toRow(targetCells));
            Ux.fn(sourceRef).rxRowConfig(results);
        }
    }
}