import __Is from './filter.__.fn.is.attribute';
import __Zn from "./zero.uca.dependency";

export default {
    siftIcon: (reference, config = {}) => (filtered) => {
        const attrs = {};
        attrs.style = {};
        if (__Is.isFiltered(reference, config)) {
            attrs.style.color = __Zn.onColor(reference);
        } else {
            attrs.style.color = {color: undefined};
        }
        return __Zn.v4Icon(config.icon, attrs);
    },
    siftClean: (attrEvent) => (event) => {
        __Zn.prevent(event)
        const {clearFilters, setSelectedKeys, confirm} = attrEvent;
        clearFilters();
        setSelectedKeys([]);
        confirm()
    }
}