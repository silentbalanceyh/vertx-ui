import Ux from 'ux';

export default {
    attributes: (identifier) => Ux.ajaxGet(`/api/model/identifier/:identifier`, {
        identifier,
    }).then((response = {}) => {
        const {attributes = []} = response;
        const processed = [];
        attributes.forEach(attribute => {
            const each = {};
            each.key = attribute.name;
            each.name = attribute.alias + "（" + attribute.name + "）";
            each.data = Ux.clone(attribute);
            processed.push(each);
        });
        return Ux.promise(processed);
    })
}