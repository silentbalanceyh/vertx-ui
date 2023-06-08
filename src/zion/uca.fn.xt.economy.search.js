import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const xtSearchConfig = (reference, config = {}) => {
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
                condition.forEach(cond => $filters[cond] = Cv.CV_DELETE);
            }
            __Zn.of(reference).in({
                $filters
            }).loading(false).handle(() => {

                const {onClick} = reference.state;
                if (__Zn.isFunction(onClick)) {
                    onClick();
                }
            }, 1)
            // reference.?etState({$filters, $loading: true});
            // __Zn.toLoading(() => {
            //     const {onClick} = reference.state;
            //     if (__Zn.isFunction(onClick)) {
            //         onClick();
            //     }
            // })
        };
        attrs.placeholder = placeholder.join('/');
        return attrs;
    }
}

export default {
    xtSearchConfig,
}