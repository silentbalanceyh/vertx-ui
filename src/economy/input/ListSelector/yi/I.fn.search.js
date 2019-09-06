import U from 'underscore';
import Ux from 'ux';

export default (reference, config = {}) => {
    if (config.search) {
        const {search} = config;
        const placeholder = [];
        const condition = [];
        Object.keys(search).forEach(key => {
            placeholder.push(search[key]);
            condition.push(key);
        });
        const attrs = {};
        attrs.onSearch = (text) => {
            const $filters = {};
            if (text) {
                condition.forEach(cond => $filters[cond] = text);
                $filters[""] = false; // Or的语句
            } else {
                condition.forEach(cond => $filters[cond] = "__DELETE__");
            }
            reference.setState({$filters, $loading: true});
            Ux.toLoading(() => {
                const {onClick} = reference.state;
                if (U.isFunction(onClick)) {
                    onClick();
                }
            })
        };
        attrs.placeholder = placeholder.join('/');
        return attrs;
    }
}