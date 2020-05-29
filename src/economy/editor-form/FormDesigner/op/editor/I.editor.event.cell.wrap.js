import Ux from 'ux';

const toSource = (fromItem, toItem) => {
    const sourceItem = Ux.clone(toItem);
    sourceItem.rowIndex = fromItem.rowIndex;
    sourceItem.cellIndex = fromItem.cellIndex;
    sourceItem.span = fromItem.span;
    return sourceItem;
}
const toTarget = (fromItem, toItem) => {
    const targetItem = Ux.clone(fromItem);
    targetItem.rowIndex = toItem.rowIndex;
    targetItem.cellIndex = toItem.cellIndex;
    targetItem.span = toItem.span;
    return targetItem;
}

export default (targetRef) => (fromItem, toItem) => {
    const {source} = fromItem;
    const sourceRef = Ux.onReference(source, 1);
    /*
    * 1. 读取源 $rows
    * 2. 读取目标 $rows
    * */
    if (sourceRef && targetRef) {
        let sourceCells = sourceRef.state.$cells;
        sourceCells = Ux.clone(sourceCells);
        let targetCells = targetRef.state.$cells;
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
            sourceRef.setState({$cells: sourceCells});
        } else {
            /*
             * 不同行交换
             */
            const targetItem = toTarget(fromItem, toItem);
            targetCells[targetItem.cellIndex] = targetItem;
            sourceRef.setState({$cells: sourceCells});
            targetRef.setState({$cells: targetCells});
        }
    }
}