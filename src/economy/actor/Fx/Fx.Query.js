import Ux from 'ux';
import U from 'underscore';

const input = (reference, defaultQuery = {}) => {
    const {$query} = reference.props;
    const queryResult = {};
    if ($query) {
        /*
         * 属性中捕捉到 $query 变量，则直接针对 $query 和 defaultQuery 执行合并
         */
        queryResult["$PROP"] = Ux.clone($query);
        queryResult[""] = true;
        queryResult["$DFT"] = defaultQuery;
    } else {
        Object.assign(queryResult, defaultQuery);
    }
    return queryResult;
};
const search = (reference) => {
    if (reference) {
        const {rxSearch} = reference.props;
        const {query = {}} = reference.state;
        if (U.isFunction(rxSearch)) {
            rxSearch(query).then(data => reference.setState({
                data, loading: false
            }));
        }
    }
};
const is = (reference, previous = {}) => {
    const {prevState, prevProps} = previous;
};
export default {
    input,
    search,
    is
};