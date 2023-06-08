import __Zn from './zero.module.dependency';

const itUi = (ui = [], eachFun, itemFun = item => item) => {
    ui.forEach((row, rowIndex) => {
        if (__Zn.isArray(row)) {
            row.forEach((cell, cellIndex) => {
                if ("string" === typeof cell) {
                    row[cellIndex] = eachFun(cell);
                } else if (__Zn.isObject(cell)) {
                    row[cellIndex] = itemFun(cell);
                }
            });
        } else {
            ui[rowIndex] = eachFun(row);
        }
    });
    return ui;
};
export default {
    itUi,
}