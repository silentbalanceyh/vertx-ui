import St from './in';

const $opDataIn = (normalized = {}, params, reference) => {
    /*
     * field                        -> field
     * optionItem.label             -> label
     * optionItem.style.width       -> width
     * optionJsx.placeholder        -> placeholder
     */
    St.dataField(normalized, params);
    return normalized;
}

export default (reference) => (config = {}) => {
    /* 初始化 */
    const $inited = {};
    const {data = {}} = reference.props;
    $inited.render = config.render;
    /* 最终值 */
    const response = $opDataIn($inited, data, reference);
    /* render 必须值 */
    // response.render = config.render;
    return response;
}