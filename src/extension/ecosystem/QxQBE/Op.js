import Ux from 'ux';

const configQr = (qbe = [], state = {}) => {
    const items = [];
    qbe.forEach(record => {
        const each = {};
        each.key = record.key;
        each.label = record.title;

        const params = {};
        params.name = record.name;
        params.code = record.code;
        each.value = Ux.encryptBase64(JSON.stringify(params));

        // icon
        const {uiConfig = {}} = record;
        each.icon = Ux.configIcon(uiConfig);
        items.push(each);
    })
    state.$qbe = items;
    if (0 < items.length) {
        // Fix Issue： Cannot read properties of undefined (reading 'value'
        state.$qbeValue = items[0].value;
    }
    return state;
}
const rxChange = (reference) => (event) => Ux.fn(reference).rxQBE(event)

export default {
    configQr,
    rxChange,
}