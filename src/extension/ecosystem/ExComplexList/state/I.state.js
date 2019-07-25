import stateTab from './I.state.tab';
import stateOption from './I.state.option';
import stateQuery from './I.state.query';
import asyncOp from './I.state.op';
import Ex from 'ex';
/*
 * 基本配置解析
 * 1. query：（静态默认的query）；
 * 2. options：（选项处理）；
 * 3. mock：模拟数据；
 * 4. component：子组件；
 * 5. table：列表表格配置；
 */
const sync = (reference, config = {}) => {
    const state = {};
    /*
     * 存储 options 到状态中（以后每次从 options 中读取）
     * 1. options中的配置比较多，需要单独提取
     * 2. options拷贝一份，会被 rxInject 处理
     */
    state.options = stateOption(reference, config);
    Object.freeze(state.options);
    /*
     * query 状态保存，根容器中保存了 query 的相关状态
     * 1. 如果外置 $query 传入，那么也会更新 query
     * 2. query 合并过后执行 update 方法，然后将 query 最终传入 Table 组件
     * 3. 当前组件：state -> query 会转换成 props -> $query 转换最终查询条件给 Table 组件
     */
    state.query = stateQuery(reference, config);
    /*
     * 准备 Tabs 的初始化状态
     * 1. 打开 Tab
     * 2. 关闭 Tab
     */
    state.tabs = stateTab(reference, config);
    /*
     * 提交和加载
     */
    return new Promise((resolve) => resolve(state));
};
const async = (reference, config = {}, state = {}) => {
    return asyncOp(reference, config)
    /* 动态Op，处理权限问题 */
        .then(op => Ex.F.toAsync(state, 'op')(op));
};
export default {
    sync,
    async,
}