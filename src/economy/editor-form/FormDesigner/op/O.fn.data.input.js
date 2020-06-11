import St from './in';
import Ux from "ux";

const $opDataIn = (normalized = {}, params, reference) => {
    /*
     * field                        -> field
     * optionItem.label             -> label
     * optionItem.style.width       -> width
     * optionJsx.placeholder        -> placeholder
     */
    St.dataField(normalized, params);
    /*
     * optionJsx.readOnly           -> readOnly
     * optionJsx.inscribe           -> inscribe
     * optionJsx.allowClear         -> allowClear
     * optionJsx.maxLength          -> maxLength
     * optionJsx.config.expr        -> expr
     */
    St.dataBasic(normalized, params);
    /*
     * optionJsx.suffix             -> suffix
     * optionJsx.prefix             -> prefix
     * optionJsx.addonBefore        -> addonBefore
     * optionJsx.addonAfter         -> addonAfter
     */
    St.dataAdorn(normalized, params);
    /*
     * optionConfig.normalize       -> normalize
     *                              -> normalizeLength
     *                              -> normalizePrecision
     */
    St.dataNorm(normalized, params);
    /*
     * optionJsx.depend.impact.reset      -> impactReset
     */
    St.dataImpact(normalized, params);
    /*
     * optionJsx.depend.enabled         -> dependEnabled
     *                                  -> dependField
     *                                  -> dependType
     *                                  -> dependBoolean
     *                                  -> dependEnum
     *                                  -> dependSource
     *                                  -> dependCondition
     *                                  -> dependValue
     */
    St.dataEnabled(normalized, params);
    /*
     * 1）必填规则
     * required,
     * requiredMessage,
     * 2）其他规则
     */
    St.dataRules(normalized, params);
    /*
     * 特殊属性
     * 1）密码框
     * optionJsx.visibilityToggle         -> visibilityToggle
     */
    St.dataComponent(normalized, params);
    /* 去空操作 */
    Ux.denull(normalized);
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