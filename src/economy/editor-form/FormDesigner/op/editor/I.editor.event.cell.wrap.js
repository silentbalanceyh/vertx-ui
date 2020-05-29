import Ux from 'ux';

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
         * 二者除了坐标，其他的都交换
         * rowIndex, cellIndex 不交换
         */
        const sourceItem = Ux.clone(toItem);
        sourceItem.rowIndex = fromItem.rowIndex;
        sourceItem.cellIndex = fromItem.cellIndex;
        sourceItem.span = fromItem.span;
        sourceCells[sourceItem.cellIndex] = sourceItem;

        const targetItem = Ux.clone(fromItem);
        targetItem.rowIndex = toItem.rowIndex;
        targetItem.cellIndex = toItem.cellIndex;
        targetItem.span = toItem.span;
        targetCells[targetItem.cellIndex] = targetItem;
        /*
         * 更新最终数据完成交换
         */
        sourceRef.setState({$cells: sourceCells});
        targetRef.setState({$cells: targetCells});
    }
}