import Value from '../../../value/index';

const filtered = Value.immutable([
    "config",   // optionJsx.config
    "trigger",  // optionJsx.trigger
    "filter"    // optionJsx.filter
]);
const fixAttrs = (jsx = {}) => {
    const attrs = {};
    Object.keys(jsx).filter(key => !filtered.contains(key))
        .forEach(key => attrs[key] = jsx[key]);
    return attrs;
};

export default {
    // 解决 ...rest的BUG
    fixAttrs
};