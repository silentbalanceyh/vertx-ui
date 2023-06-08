import __Zn from './zero.module.dependency';

const __inKey = (key = "") => {
    let keyStr;
    if (key.startsWith("$")) {
        keyStr = key;
    } else {
        keyStr = `$${key}`;
    }
    return keyStr;
}
const __inRef = (reference, propFirst = true) => {
    if (propFirst) {
        return reference.props;
    } else {
        const state = reference.state;
        return (state) ? state : reference.props;
    }
}
const ambWide = (reference, key, propFirst = true) => {
    const ref = __inRef(reference, propFirst);
    const field = __inKey(key);
    const found = ref[field];
    return __Zn.isTEntity(found) ? found.to() : found;
}
export default {
    ambWide,
}