// 导入当前目录
import Apply from './O.apply';
import Parser from './I.parser.up';
// 导入内部 ai 解析器
import aiWindow from './I.ai.window';
import aiAjax from './I.ai.ajax';
import aiForm from './I.ai.form';
import aiButton from './I.ai.button';
import aiColumn from './I.ai.column';
import aiOption from './I.ai.option';

const aiExprTabs = (items = [], props = {}) =>
    items.map(item => Parser.parseItem(item, "tabs"))
        .map(Apply.applyKey);

const aiExprFilter = (filter = "") =>
    Parser.parseItem(filter, "filter");

export default {
    aiExprFilter,   /* 解析 filter 专用 */
    aiExprTabs,     /* 专用 Tabs 解析 */

    /* 解析 datum 成为 option 专用 */
    ...aiOption,
    /* 解析 icon 专用 */
    /* 解析 列 column 专用 */
    ...aiColumn,

    /* （Button）解析 button 专用，如 PageCard 中的 left/right 等 */
    /* （Button）表单专用的按钮解析流程 */
    ...aiButton,

    /* 表单专用 field 解析流程 */
    /* 表单专用 field 的扩展解析流程 */
    /* 表单专用 title （ field = title ）解析 */
    ...aiForm,

    /* 专用 ajax 解析 */
    ...aiAjax,

    /* 专用 drawer 解析 */
    /* 专用 popover 解析 */
    /* 专用 dialog - window 解析 */
    ...aiWindow,
};