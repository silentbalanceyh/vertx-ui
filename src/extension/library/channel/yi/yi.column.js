import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 列渲染专用处理函数，用于处理`USER`特殊类型的`$render`执行数据预处理
 *
 * 1. 提取所有`USER`列相关信息。
 * 2. 根据传入数据执行`$lazy`的计算（预处理Ajax，系统中唯一调用`Ux.ajaxEager`的位置。
 *
 * @memberOf module:_channel
 * @method yiColumn
 * @param {ReactComponent} reference React对应组件引用
 * @param {State} initState 返回当前组件状态
 * @param {Object} $data 搜索的最终结果，$data.list 中包含数据
 * @returns {Promise<T>} 执行更新过后的状态
 */
export default (reference, initState = {}, $data = []) => {
    initState = Ux.clone(initState);
    const {$table} = initState;
    if ($table.columns) {
        const lazyColumn = $table.columns
            .filter(item => "USER" === item['$render']);
        return Ux.ajaxEager(reference, lazyColumn, $data ? $data.list : [])
            .then($lazy => Ux.promise(initState, "$lazy", $lazy))
            .then(state => Ux.promise(state, "$data", $data));
    } else {
        console.error("Table columns error: ", $table);
    }
}