import Ux from "ux";

export default (reference, config = {}) => {
    /* 1.直接提取 query */
    const query = Ux.clone(config.query);
    let defaultQuery = Ux.irGrid(query, reference);
    const {$query} = reference.props;
    if ($query) {
        /* 2.提取 $query 参数 */
        defaultQuery = Ux.aiCriteria(defaultQuery, $query);
    }
    return defaultQuery;
};