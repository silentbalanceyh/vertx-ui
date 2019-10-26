import Ux from 'ux';
import U from 'underscore';

export default (config = {}) => {
    /* SPC-01.1: config 中必须包含 query 节点 */
    if (!config.query) return Ux.E.fxMessage(10009, 'config', 'query');
    /* SPC-01.2: config 中的 query 必须是 Object */
    if (!U.isObject(config.query)) return Ux.E.fxMessage(10010, 'config.query', 'Array');
    /* SPC-01.3: config 中必须包含 options 节点 */
    if (!config.options) return Ux.E.fxMessage(10009, 'config', 'options');
    /* SPC-01.4: config 中的 options 必须是 Object */
    if (!U.isObject(config.options)) return Ux.E.fxMessage(10010, 'config.options', 'Object');
    /* SPC-01.5: config 中必须包含 component */
    if (!config.component) return Ux.E.fxMessage(10009, 'config', 'component');
    /* SPC-01.6: config 中的 component 必须是 Object */
    if (!U.isObject(config.component)) return Ux.E.fxMessage(10010, 'config.component', 'Object');
    /* SPC-01.7: config 中比比包含 table */
    if (!config.table) return Ux.E.fxMessage(10009, 'config', 'table');
    /* SPC-01.8: config 中的 table 必须是 Object */
    if (!U.isObject(config.table)) return Ux.E.fxMessage(10010, 'config.table', 'Object');
}