import Ux from "ux";
import U from "underscore";

export default (config = {}) => {
    const query = config.query;
    /* SPC-02.1: config.query 中必须包含 projection 节点 */
    if (!query.projection) return Ux.E.fxMessageError(10009, 'config.query', 'projection');
    /* SPC-02.2: config.query.projection 必须是 Array */
    if (!U.isArray(query.projection)) return Ux.E.fxMessageError(10010, 'config.query.projection', 'Array');
    /* SPC-02.3: config.query 中必须包含 pager 节点 */
    if (!query.pager) return Ux.E.fxMessageError(10009, 'config.query', 'pager');
    /* SPC-02.4: config.query 中必须包含 sorter 节点 */
    if (!query.sorter) return Ux.E.fxMessageError(10009, 'config.query', 'sorter');
    /* SPC-02.5: config.query 中碧玺包含 criteria 节点 */
    if (!query.criteria) return Ux.E.fxMessageError(10009, 'config.query', 'criteria');
}