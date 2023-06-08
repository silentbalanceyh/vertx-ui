import RENDERS from './variant-column/column.v.render.define';

import __ROBIN from './table.__.fn.config.column.robin';

const configScroll = ($table = {}, data = [], reference) =>
    __ROBIN.configScroll($table, data, reference);
const configColumn = (reference, columns = [], ops = {}) =>
    __ROBIN.configColumnAmb(reference, columns, ops, RENDERS);

const configTable = (reference, table = {}, ops = {}) =>
    __ROBIN.configTableAmb(reference, table, ops, RENDERS);
export default {
    configScroll,
    configColumn,
    configTable,
}