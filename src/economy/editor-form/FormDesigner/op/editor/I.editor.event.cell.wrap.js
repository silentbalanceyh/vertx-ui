import Ux from 'ux';
import Cmn from "../library";

const toSource = (fromItem, toItem) => {
    const sourceItem = Ux.clone(toItem);
    sourceItem.rowIndex = fromItem.rowIndex;
    sourceItem.rowKey = fromItem.rowKey;
    sourceItem.cellIndex = fromItem.cellIndex;
    sourceItem.span = fromItem.span;
    return sourceItem;
}
const toTarget = (fromItem, toItem) => {
    const targetItem = Ux.clone(fromItem);
    targetItem.rowIndex = toItem.rowIndex;
    targetItem.rowKey = toItem.rowKey;
    targetItem.cellIndex = toItem.cellIndex;
    targetItem.span = toItem.span;
    return targetItem;
}

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
         * 源
         */
        const sourceItem = toSource(fromItem, toItem);
        sourceCells[sourceItem.cellIndex] = sourceItem;
        if (fromItem.rowIndex === toItem.rowIndex) {
            /*
             * 同行交换
             */
            const targetItem = toTarget(fromItem, toItem);
            sourceCells[targetItem.cellIndex] = targetItem;
            Cmn.rowRefresh(sourceRef, sourceCells);
        } else {
            /*
             * 不同行交换
             */
            const targetItem = toTarget(fromItem, toItem);
            targetCells[targetItem.cellIndex] = targetItem;
            /*
             * {
             *      config: {
             *          key: "xxx"
             *      },
             *      data: []
             * }
             */
            const processed = [];
            processed.push(toRow(sourceCells));
            processed.push(toRow(targetCells));
            Ux.fn(sourceRef).rxRowConfig(processed);
        }
    }
}