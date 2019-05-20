import Ux from 'ux';

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
        console.info(rxSearch, query);
    }
};
export default {
    input,
    search
}