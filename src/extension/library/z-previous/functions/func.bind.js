import Gen from './func.generate';
import G from '../../functions/global/datum';
import Opt from '../../functions/global/option';
import Ux from 'ux';
import Tab from './func.bind.tab';

const rxSearch = (reference) => Gen.switcher(reference, 'rxSearch',
    (params) => {
        /*
         * 必须配置 ajax.search.uri
         */
        const {options = {}} = G.state(reference);
        const uri = options[Opt.AJAX_SEARCH_URI];
        return Ux.ajaxPost(uri, params);
    });

const rxRefresh = (reference) => () => {
    /* 读取默认参数 $query */
    const {$query = {}} = G.state(reference);
    return rxSearch(reference)($query);
};
const rxDelete = (reference) => (key) => {
    if (key) {
        /*
         * 必须配置 ajax.delete.uri
         */
        const {options = {}} = G.state(reference);
        const uri = options[Opt.AJAX_DELETE_URI];
        return Ux.ajaxDelete(uri, {key});
    }
};
const rxDetail = (reference) => (key) => {
    if (key) {
        const {options = {}} = G.state(reference);
        const uri = options[Opt.AJAX_GET_URI];
        return Ux.ajaxGet(uri, {key});
    }
};

const rxSelect = (reference) => ($selected = []) => reference.setState({$selected});
const rxCondition = (reference) => (
    $condition = {}, // 条件本身: field = value
    $terms = {},     // 条件对应的配置: field = type
) => reference.setState({
    $condition, $terms,
});
const rxInit = (reference) => ($inited = {}, additional = {}) => reference.setState({
    $inited,
    ...additional
});
const rxQuery = (reference) => (inputQuery = {}) => {
    const {query = {}} = G.state(reference, true);
    /* 1. 提取 connector */
    let connector = "AND";
    if (inputQuery.hasOwnProperty("")) {
        connector = inputQuery[""] ? "AND" : "OR";
    }
    /* 2. 合并 */
    const $query = Ux.aiCriteria(query, inputQuery, connector);
    reference.setState({query: $query});
};
const rxClean = (reference) => (event) => {
    Gen.prevent(event);
    /*
     * 外置清空 $condition
     */
    reference.setState({
        $condition: [], // 条件重置
        $dirty: true // 清空完成过后重新加载
    })
};
export default {
    rxSearch,       // reference 为 ExComplexList（生成搜索专用的 Promise）
    rxDelete,       // reference 为 ExComplexList（生成删除专用的 Promise）
    rxDetail,       // reference 为 ExComplexList（生成读取专用的 Promise）
    rxRefresh,      // reference 为 ExComplexList（生成刷新专用的 Promise）

    rxInit,         // reference 为 ExComplexList
    rxSelect,       // reference 为 ExComplexList，
    rxCondition,    // reference 为 ExComplexList，修改 $condition
    rxQuery,        // reference 为 ExComplexList, 修改 $filters
    rxClean,        // reference 为 ExComplexList, 清除 $condition 专用

    ...Tab,
}