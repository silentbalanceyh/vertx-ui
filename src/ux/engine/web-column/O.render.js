import Cell from './O.render.cell';
import State from './O.render.state';
import Unit from './O.render.unit';
import Dynamic from './O.render.dynamic';

const columnRender = (column, reference, ops) => {
    if (column.hasOwnProperty("$render")) {
        const fnRender = Cell[column["$render"]];
        if (fnRender) {
            column.render = fnRender(reference, column, ops);
        }
    }
};
export default {
    columnRender,
    Column: {
        Cell,
        State,
        Unit,
        Dynamic
    }
}