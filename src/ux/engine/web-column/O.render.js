import CellRender from './O.render.cell';

const columnRender = (column, reference, ops) => {
    if (column.hasOwnProperty("$render")) {
        const fnRender = CellRender[column["$render"]];
        if (fnRender) {
            column.render = fnRender(reference, column, ops);
        }
    }
};
export default {
    columnRender
}