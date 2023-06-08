import __Zn from '../zero.uca.dependency';

const rxTree = (reference) => ($keySet = []) => {
    const {data = [], config = {}, value = []} = reference.props;
    // fix: https://github.com/silentbalanceyh/hotel/issues/391
    const valueKeys = value.map(item => item.key);
    const items = data
        .filter(item => $keySet.includes(item.key) || valueKeys.includes(item.key));
    const {initialize = {}} = config;
    items.forEach(item => {
        const found = __Zn.elementUnique(value, 'key', item.key);
        if (found) {
            Object.assign(item, found);
        } else {
            Object.keys(initialize).forEach(from => {
                if (!item[from]) {
                    const to = initialize[from];
                    if (to.startsWith("NUMBER")) {
                        item[from] = __Zn.valueInt(to.split(":")[1], 0);
                    } else {
                        item[from] = item[to];
                    }
                }
            })
        }
    })
    __Zn.fn(reference).onChange(items);
}
const rxSearch = (reference) => $keyword =>
    __Zn.of(reference).in({$keyword}).done();
// reference.?etState({$keyword})
const rxDelete = (reference, key) => (event) => {
    __Zn.prevent(event);
    const {value = []} = reference.props;
    const items = value.filter(item => key !== item.key);
    __Zn.fn(reference).onChange(items);
}
export default {
    rxTree,
    rxSearch,
    rxDelete,
}