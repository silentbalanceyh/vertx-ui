import Ux from "ux";

const inject = (reference, ...keys) => {
    const {set = {}} = reference.state;
    set.rxInject = injectOptFun.apply(this, [reference].concat(keys));
    return set;
};
const injectOptFun = (reference, ...keys) => {
    let options = [];
    if (0 === keys.length) {
        const attribute = Ux.fromHoc(reference, "attribute");
        if (attribute.hoc && attribute.hoc.options) {
            options = Object.keys(attribute.hoc.options);
        }
    } else {
        options = keys;
    }
    const {set = {}} = reference.state;
    return (data) => {
        options.forEach(key => {
            if (set.hasOwnProperty(key)) {
                data[key] = set[key];
            }
        });
        return data;
    };
};
const injectSet = (reference) => (key) => {
    const {set = {}} = reference.state;
    if (set.hasOwnProperty(key)) {
        return set[key];
    } else {
        return undefined;
    }
};
export default {
    injectOptFun,
    inject,
    injectSet
}