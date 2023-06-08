import Ux from 'ux';

export default {
    // identifier -> { identifier }
    inData: (identifier) => ({identifier}),
    // api
    uri: `/api/model/identifier/:identifier`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    // response
    outData: (response) => {
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
    }
}