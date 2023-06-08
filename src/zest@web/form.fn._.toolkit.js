import __Zn from './zero.module.dependency';


const toFieldName = (cell) => {
    let field;
    if (__Zn.isObject(cell)) {
        if (cell.metadata) {
            field = cell.metadata.split(',')[0]
        } else {
            field = cell.field;
        }
    } else {
        field = cell.split(',')[0];
    }
    return field;
}

const itField = (form = {}, consumer) => {
    const {ui = []} = form;
    ui.forEach(item => item.forEach(cell => {
        if (cell.complex) {
            const {config = {}} = cell;
            const {pages = {}} = config;
            Object.keys(pages).forEach(key => {
                const pageConfig = pages[key];
                itField(pageConfig, consumer);
            })
        } else {
            let field = toFieldName(cell);
            if (__Zn.isFunction(consumer)) {
                consumer(field, cell);
            }
        }
    }))
}
export default {
    itField,
    toFieldName,
}