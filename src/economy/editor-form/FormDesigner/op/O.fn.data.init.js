import Ux from 'ux';
import Ld from './library';

export default (config) => {
    const formRef = Ux.clone(config);
    {
        // 默认3列给定值
        if (formRef && !formRef.hasOwnProperty('columns')) {
            formRef.columns = 3;
        }
        // 布局修正处理
        if (!formRef.hasOwnProperty('window')) {
            formRef.window = 1;
        }
        // options处理
        if (!formRef.options) {
            formRef.options = {window: formRef.window};
        }
    }
    {
        // 默认数据处理
        if (Ux.isArray(formRef.ui) && 0 < formRef.ui.length) {
            const $ui = [];
            formRef.ui.forEach((uiRow, rowIndex) => {
                const $uiRow = [];
                const rowKey = `row-${Ux.randomString(8)}`
                uiRow.forEach((uiCell, cellIndex) => {
                    const $uiCell = Ld.cellConfig(formRef, uiCell,
                        {
                            key: `cell-${Ux.randomString(8)}`,
                            rowKey,                     // 行主键
                            rowIndex,                   // 行索引
                            cellIndex,                  // 单元格索引
                            columns: formRef.columns,   // 表单默认列数量
                            length: uiRow.length        // 当前行的列数量
                        });
                    $uiRow.push($uiCell);
                });
                $ui.push($uiRow);
            });
            formRef.ui = $ui;                           // 行替换
        }
    }
    return {form: formRef};
}