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

export default (targetRef) => (fromItem, toItem) => {
    const {source} = fromItem;
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
        if (fromItem.rowIndex === toItem.rowIndex) {
            /*
             * 同行交换
             * 1）交换坐标
             * 2）交换 span
             */
            const sourceItem = Ux.clone(fromItem);
            sourceItem.cellIndex = toItem.cellIndex;
            sourceItem.span = toItem.span;

            const targetItem = Ux.clone(toItem);
            targetItem.cellIndex = fromItem.cellIndex;
            targetItem.span = fromItem.span;

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
            const sourceItem = Ux.clone(fromItem);
            sourceItem.cellIndex = toItem.cellIndex;
            sourceItem.rowIndex = toItem.rowIndex;
            sourceItem.rowKey = toItem.rowKey;
            sourceItem.span = toItem.span;

            const targetItem = Ux.clone(toItem);
            targetItem.cellIndex = fromItem.cellIndex;
            targetItem.rowIndex = fromItem.rowIndex;
            targetItem.rowKey = fromItem.rowKey;
            targetItem.span = fromItem.span;

            /*
             * 修改 sourceCells / targetCells
             */
            sourceCells[fromItem.cellIndex] = targetItem;
            targetCells[toItem.cellIndex] = sourceItem;

            const results = [];
            results.push(toRow(sourceCells));
            results.push(toRow(targetCells));
            Ux.fn(sourceRef).rxRowConfig(results);
        }
    }
}