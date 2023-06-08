import __Zs from 'zs';

/**
 * 「标准」`Ux.aiAddRemove`
 *
 *
 * @memberOf module:ai-web/zest
 * @param reference
 * @param config
 * @returns {*}
 */
const aiAddRemove = (reference, config = {}) =>
    __Zs.aiAddRemove(reference, config);
/**
 * 「标准」`Ux.aiTopBar`
 *
 *
 * @memberOf module:ai-web/zest
 * @param reference
 * @param buttons
 * @param disabled
 * @returns {*}
 */
const aiTopBar = (reference, buttons = [], disabled = {}) =>
    __Zs.aiTopBar(reference, buttons, disabled);
export default {
    aiAddRemove,        // Remove / Add Button
    /**
     * 「标准」`Ux.aiCommand`
     *
     * @memberOf module:ai-web/zest
     * @method aiCommand
     */
    aiCommand: __Zs.aiCommand,          // 代替原来的 opCmdPopover
    aiTopBar,           // 左上专用主按钮，右上为 aiExtra
}