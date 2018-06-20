import Ux from 'ux';

const getRenders = () => ({
    VECTOR: Ux.aiUnitVector,
    TEXT: Ux.aiUnitText,
    DATE: Ux.aiUnitDate,
    RADIO: Ux.aiUnitRadio,
    LABEL: Ux.aiUnitLabel,
    DECIMAL: Ux.aiUnitDecimal,
});
const renderColumn = (reference, columns = [], jsx, render = {}) => {
    columns.forEach((item) => {
        if (render[item.dataIndex]) {
            item.render = render[item.dataIndex]
        } else {
            const type = item['$type'] ? item['$type'] : "TEXT";
            const RENDER = getRenders();
            const render = RENDER[type];
            if (render) {
                item.render = render(reference, item, jsx)
            }
        }
    })
};
export default {
    renderColumn
}