import Cv from '../../constant';

/**
 * 【开发模式】过滤参数专用
 * @method filters
 * @param reference React对应组件引用 React.PureComponent
 * @param input 输入的Query参数
 * @param query Prop属性中的Query参数
 * @param filters 最终搜索用的Query参数
 * @param cond 搜索条件
 */
const filters = (reference = {}, {
    input = {}, query = {}, filters = {}, cond
}) => {
    if (Cv.DEBUG) {
        let message = `%c 「Zero」 [Filter] Filters Data Process`;
        console.groupCollapsed(message, "color:red;font-weight:900");
        console.log(`%c 「Zero」 Input Query -> `, 'color:#009900;font-weight:900', input);
        console.log(`%c 「Zero」 Prop Query -> `, 'color:#660099;font-weight:900', query);
        console.log(`%c 「Zero」 Search Filter -> `, 'color:#0099FF;font-weight:900', filters);
        console.log(`%c 「Zero」 Cond -> `, 'color:blue;font-weight:900', cond);
        console.groupEnd();
    }
};

export default {
    filters,
}