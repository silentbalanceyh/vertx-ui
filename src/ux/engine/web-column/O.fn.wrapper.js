import Abs from '../../abyss';
import Ut from '../../unity';

export default (reference, column = {}) => {
    let fnOriginal;
    if (Abs.isFunction(column.render)) {
        fnOriginal = column.render;
        delete column.render;
    }
    const {$config = {}} = column;
    if (!Abs.isEmpty($config)) {
        const {wrapper = false} = $config;
        if (wrapper) {
            const {rowSpan} = $config;
            if (undefined !== rowSpan) {
                column.render = Ut.cellWrapper(column, fnOriginal)
            }
        }
    }
    if (!column.render) {
        if (Abs.isFunction(fnOriginal)) {
            column.render = fnOriginal;
        }
    }
    return column;
}