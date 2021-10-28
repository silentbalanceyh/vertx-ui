import Ux from 'ux';

const rxTree = (reference) => ($keySet = []) => {
    const {data = [], config = {}, value = []} = reference.props;
    const items = data.filter(item => $keySet.includes(item.key));
    const {initialize = {}} = config;
    items.forEach(item => {
        const found = Ux.elementUnique(value, 'key', item.key);
        if (found) {
            Object.assign(item, found);
        } else {
            Object.keys(initialize).forEach(from => {
                if (!item[from]) {
                    const to = initialize[from];
                    if (to.startsWith("NUMBER")) {
                        item[from] = Ux.valueInt(to.split(":")[1], 0);
                    } else {
                        item[from] = item[to];
                    }
                }
            })
        }
    })
    Ux.fn(reference).onChange(items);
}
const rxSearch = (reference) => $keyword =>
    reference.setState({$keyword})
const rxDelete = (reference, key) => (event) => {
    Ux.prevent(event);
    const {value = []} = reference.props;
    const items = value.filter(item => key !== item.key);
    Ux.fn(reference).onChange(items);
}
export default {
    rxTree,
    rxSearch,
    rxDelete,
}